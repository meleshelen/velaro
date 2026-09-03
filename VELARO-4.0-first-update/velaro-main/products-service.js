(function () {
  "use strict";

  const config = window.VELARO_SUPABASE || {};
  const baseUrl = String(config.url || "").replace(/\/$/, "");
  const tableUrl = `${baseUrl}/rest/v1/products`;
  const authUrl = `${baseUrl}/auth/v1`;
  let accessToken = sessionStorage.getItem("velaroAdminAccessToken") || "";

  function isConfigured() {
    return Boolean(
      config.url &&
      config.publishableKey &&
      !String(config.publishableKey).includes("PASTE_YOUR")
    );
  }

  function publicHeaders(extra = {}) {
    return {
      apikey: config.publishableKey,
      Authorization: `Bearer ${config.publishableKey}`,
      "Content-Type": "application/json",
      ...extra
    };
  }

  function adminHeaders(extra = {}) {
    if (!accessToken) throw new Error("Спочатку увійдіть в адмін-панель.");
    return {
      apikey: config.publishableKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...extra
    };
  }

  function categoryName(category) {
    return {
      women: "Жіночий одяг",
      men: "Чоловічий одяг",
      "women-shoes": "Жіноче взуття",
      "men-shoes": "Чоловіче взуття",
      lingerie: "Жіноча білизна"
    }[category] || "Товар";
  }

  function parseSizes(value) {
    if (!value) return {};
    if (typeof value === "object") return value;
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function rowToProduct(row) {
    const sizeData = parseSizes(row.sizes);
    const product = {
      id: Number(row.id),
      name: row.name || "Без назви",
      article: row.article || "",
      category: row.category || "women",
      categoryName: categoryName(row.category),
      type: row.type || "clothes",
      price: Number(row.price || 0),
      oldPrice: row.old_price == null ? null : Number(row.old_price),
      image: row.image || "images/banners/hero-placeholder.svg",
      images: [row.image || "images/banners/hero-placeholder.svg"],
      description: row.description || "",
      badge: row.badge || ""
    };

    if (product.type === "lingerie") {
      product.braSizes = sizeData.bra || {};
      product.pantiesSizes = sizeData.panties || {};
    } else {
      product.sizes = sizeData.regular || sizeData || {};
    }
    return product;
  }

  function productToRow(product) {
    const sizeData = product.type === "lingerie"
      ? { bra: product.braSizes || {}, panties: product.pantiesSizes || {} }
      : { regular: product.sizes || {} };

    return {
      id: Number(product.id),
      name: product.name,
      article: product.article || "",
      category: product.category,
      type: product.type,
      price: Number(product.price || 0),
      old_price: product.oldPrice == null || product.oldPrice === "" ? null : Number(product.oldPrice),
      image: product.image || "",
      description: product.description || "",
      badge: product.badge || "",
      sizes: JSON.stringify(sizeData)
    };
  }

  async function request(url, options = {}) {
    if (!isConfigured()) {
      throw new Error("Supabase не налаштовано: вставте Publishable key у js/supabase-config.js");
    }
    const response = await fetch(url, options);
    const text = await response.text();
    if (!response.ok) {
      let message = text;
      try {
        const data = JSON.parse(text);
        message = data.msg || data.message || data.error_description || data.error || text;
      } catch (_) {}
      throw new Error(message || `Помилка Supabase: ${response.status}`);
    }
    return text ? JSON.parse(text) : null;
  }

  async function signIn(email, password) {
    const data = await request(`${authUrl}/token?grant_type=password`, {
      method: "POST",
      headers: publicHeaders(),
      body: JSON.stringify({ email, password })
    });
    accessToken = data.access_token || "";
    if (!accessToken) throw new Error("Не вдалося отримати доступ до адмін-панелі.");
    sessionStorage.setItem("velaroAdminAccessToken", accessToken);
    return data.user || null;
  }

  async function getUser() {
    if (!accessToken || !isConfigured()) return null;
    try {
      return await request(`${authUrl}/user`, { headers: adminHeaders() });
    } catch (_) {
      signOut();
      return null;
    }
  }

  function signOut() {
    accessToken = "";
    sessionStorage.removeItem("velaroAdminAccessToken");
  }

  async function list() {
    const rows = await request(`${tableUrl}?select=*&order=id.asc`, { headers: publicHeaders() });
    return Array.isArray(rows) ? rows.map(rowToProduct) : [];
  }

  async function create(product) {
    const rows = await request(tableUrl, {
      method: "POST",
      headers: adminHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(productToRow(product))
    });
    return rowToProduct(rows[0]);
  }

  async function update(product) {
    const rows = await request(`${tableUrl}?id=eq.${encodeURIComponent(product.id)}`, {
      method: "PATCH",
      headers: adminHeaders({ Prefer: "return=representation" }),
      body: JSON.stringify(productToRow(product))
    });
    return rowToProduct(rows[0]);
  }

  async function remove(id) {
    await request(`${tableUrl}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: adminHeaders({ Prefer: "return=minimal" })
    });
  }

  async function importDefaults(defaults) {
    await request(`${tableUrl}?on_conflict=id`, {
      method: "POST",
      headers: adminHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(defaults.map(productToRow))
    });
  }

  window.VelaroProductsService = {
    isConfigured,
    signIn,
    signOut,
    getUser,
    list,
    create,
    update,
    remove,
    importDefaults
  };
})();
