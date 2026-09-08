// Робота каталогу товарів із Supabase

function parseJsonValue(value, fallback = {}) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Не вдалося прочитати JSON:", value);
    return fallback;
  }
}


function getSupabaseClient() {
  const config = window.VELARO_SUPABASE;

  if (!config?.url || !config?.publishableKey) {
    throw new Error("Не знайдено налаштування Supabase");
  }

  if (!window.supabase?.createClient) {
    throw new Error("Бібліотека Supabase не підключена");
  }

  if (!window.velaroSupabaseClient) {
    window.velaroSupabaseClient = window.supabase.createClient(
      config.url,
      config.publishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }

  return window.velaroSupabaseClient;
}


function convertSupabaseProduct(product) {
  const sizesData = parseJsonValue(product.sizes, {});
  const imagesData = parseJsonValue(product.images, []);

  const images =
    Array.isArray(imagesData) && imagesData.length > 0
      ? imagesData
      : product.image
      ? [product.image]
      : [];

  const isLingerie = product.type === "lingerie";

  return {
    id: Number(product.id),
    name: product.name || "",
    article: product.article || "",
    category: product.category || "",
    categoryName: product.category_name || "",
    type: product.type || "",
    price: Number(product.price) || 0,

    oldPrice:
      product.old_price !== null && product.old_price !== undefined
        ? Number(product.old_price)
        : null,

    image: product.image || images[0] || "",
    images,
    description: product.description || "",
    badge: product.badge || "",
    color: product.color || "",
    sortOrder: Number(product.sort_order ?? product.id ?? 0),

    sizes: isLingerie ? {} : sizesData,

    braSizes: isLingerie
      ? parseJsonValue(product.bra_sizes, sizesData.bra || {})
      : {},

    pantiesSizes: isLingerie
      ? parseJsonValue(product.panties_sizes, sizesData.panties || {})
      : {}
  };
}


// Не дозволяємо запускати одночасно багато однакових запитів
let productsLoadingPromise = null;


async function requestProductsFromSupabase() {
  const client = getSupabaseClient();

  let { data, error } = await client
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  // Сумісність, якщо SQL-оновлення 5.1 ще не запускали.
  if (error && String(error.message || "").includes("sort_order")) {
    const fallback = await client
      .from("products")
      .select("*")
      .order("id", { ascending: true });
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    throw error;
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("У Supabase немає товарів");
  }

  const convertedProducts = data.map(convertSupabaseProduct);

  // Зберігаємо останню успішну версію каталогу
  try {
    localStorage.setItem(
      "velaroSupabaseProductsCache",
      JSON.stringify(convertedProducts)
    );
  } catch (error) {
    console.warn("Не вдалося зберегти кеш товарів:", error);
  }

  console.log(
    `Завантажено товарів із Supabase: ${convertedProducts.length}`
  );

  return convertedProducts;
}


function getCachedProducts() {
  try {
    const cached = JSON.parse(
      localStorage.getItem("velaroSupabaseProductsCache")
    );

    if (Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  } catch (error) {
    console.warn("Не вдалося прочитати кеш товарів:", error);
  }

  return null;
}


async function loadProductsFromSupabase() {
  if (productsLoadingPromise) {
    return productsLoadingPromise;
  }

  productsLoadingPromise = (async () => {
    try {
      const products = await requestProductsFromSupabase();
      return products;
    } catch (error) {
      console.error(
        "Помилка завантаження товарів із Supabase:",
        error
      );

      const cachedProducts = getCachedProducts();

      if (cachedProducts) {
        console.warn("Показуємо останній збережений кеш товарів.");
        return cachedProducts;
      }

      console.warn("Показуємо локальний каталог.");
      return structuredClone(DEFAULT_PRODUCTS);
    }
  })();

  try {
    return await productsLoadingPromise;
  } finally {
    productsLoadingPromise = null;
  }
}
