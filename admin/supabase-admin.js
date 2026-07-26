function getAdminSupabaseClient() {
  const config = window.VELARO_SUPABASE;

  if (!config?.url || !config?.publishableKey) {
    throw new Error("Не знайдено налаштування Supabase.");
  }

  if (!window.supabase?.createClient) {
    throw new Error("Бібліотека Supabase не підключена.");
  }

  return window.supabase.createClient(
    config.url,
    config.publishableKey
  );
}

function convertAdminProduct(row) {
  return {
    id: Number(row.id),
    name: row.name || "",
    article: row.article || "",
    category: row.category || "",
    categoryName: row.category_name || "",
    type: row.type || "clothes",
    price: Number(row.price || 0),
    oldPrice:
      row.old_price === null || row.old_price === undefined
        ? null
        : Number(row.old_price),
    image: row.image || "",
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || "",
    badge: row.badge || "",
    sizes: row.sizes || {},
    braSizes: row.bra_sizes || {},
    pantiesSizes: row.panties_sizes || {}
  };
}

function prepareProductForSupabase(product) {
  return {
    name: product.name,
    article: product.article || "",
    category: product.category,
    category_name: product.categoryName,
    type: product.type,
    price: Number(product.price),
    old_price:
      product.oldPrice === "" ||
      product.oldPrice === null ||
      product.oldPrice === undefined
        ? null
        : Number(product.oldPrice),
    image: product.image || "",
    images: Array.isArray(product.images)
      ? product.images
      : product.image
        ? [product.image]
        : [],
    description: product.description || "",
    badge: product.badge || "",
    sizes: product.sizes || {},
    bra_sizes: product.braSizes || {},
    panties_sizes: product.pantiesSizes || {}
  };
}

const velaroAdminApi = {
  client: null,

  getClient() {
    if (!this.client) {
      this.client = getAdminSupabaseClient();
    }

    return this.client;
  },

  async loadProducts() {
    const { data, error } = await this.getClient()
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return (data || []).map(convertAdminProduct);
  },

  async createProduct(product) {
    const productData = prepareProductForSupabase(product);

    const { data, error } = await this.getClient()
      .from("products")
      .insert(productData)
      .select("*")
      .single();
console.log("UPDATE RESULT:", data);
console.log("UPDATE ERROR:", error);
    if (error) {
      throw error;
    }

    return convertAdminProduct(data);
  },

  async updateProduct(productId, product) {
    const productData = prepareProductForSupabase(product);

    const { data, error } = await this.getClient()
      .from("products")
      .update(productData)
      .eq("id", productId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return convertAdminProduct(data);
  },

  async deleteProduct(productId) {
    const { error } = await this.getClient()
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw error;
    }

    return true;
  }
};

window.velaroAdminApi = velaroAdminApi;