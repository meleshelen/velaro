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
      config.publishableKey
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

    sizes: isLingerie ? {} : sizesData,

    braSizes: isLingerie
      ? parseJsonValue(product.bra_sizes, sizesData.bra || {})
      : {},

    pantiesSizes: isLingerie
      ? parseJsonValue(product.panties_sizes, sizesData.panties || {})
      : {}
  };
}

async function loadProductsFromSupabase() {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("У Supabase немає товарів. Використано резервний каталог.");
      return structuredClone(DEFAULT_PRODUCTS);
    }

    console.log(`Завантажено товарів із Supabase: ${data.length}`);

    return data.map(convertSupabaseProduct);
  } catch (error) {
    console.error("Помилка завантаження товарів із Supabase:", error);

    return structuredClone(DEFAULT_PRODUCTS);
  }
}