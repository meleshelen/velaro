const productsAuth = document.getElementById("products-auth");
const adminContent = document.getElementById("admin-content");
const productsAuthForm = document.getElementById("products-auth-form");
const productsAuthEmail = document.getElementById("products-auth-email");
const productsAuthPassword = document.getElementById("products-auth-password");
const productsAuthMessage = document.getElementById("products-auth-message");
const adminLogoutButton = document.getElementById("admin-logout");

function getProductsAuthClient() {
  return window.velaroAdminApi.getClient();
}

function showAdminContent() {
  productsAuth.hidden = true;
  adminContent.hidden = false;
}

function showAdminLogin() {
  productsAuth.hidden = false;
  adminContent.hidden = true;
}

async function checkProductsAuth() {
  try {
    const client = getProductsAuthClient();
    const { data, error } = await client.auth.getSession();

    if (error) {
      console.error("Помилка перевірки сесії:", error);
      productsAuthMessage.textContent = `Помилка сесії: ${error.message || "невідома помилка"}`;
      showAdminLogin();
      return;
    }

    if (data?.session) {
      showAdminContent();
      await initializeAdminProducts();
    } else {
      showAdminLogin();
    }
  } catch (error) {
    console.error("Помилка запуску адмінки:", error);
    productsAuthMessage.textContent = `Не вдалося підключити адмінку: ${error.message || error}`;
    showAdminLogin();
  }
}

productsAuthForm.addEventListener("submit", async event => {
  event.preventDefault();

  const email = productsAuthEmail.value.trim();
  const password = productsAuthPassword.value;
  const submitButton = productsAuthForm.querySelector('button[type="submit"]');

  productsAuthMessage.textContent = "Перевіряємо дані…";
  if (submitButton) submitButton.disabled = true;

  try {
    const client = getProductsAuthClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Помилка входу:", error);
      productsAuthMessage.textContent = `Не вдалося увійти: ${error.message || "невідома помилка"}`;
      return;
    }

    if (!data?.session || !data?.user) {
      productsAuthMessage.textContent = "Supabase не повернув сесію. Спробуйте ще раз.";
      return;
    }

    // Додаткова перевірка, що сесія дійсно активна.
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData?.user) {
      console.error("Помилка перевірки користувача:", userError);
      productsAuthMessage.textContent = `Вхід виконано, але сесію не підтверджено: ${userError?.message || "невідома помилка"}`;
      return;
    }

    productsAuthMessage.textContent = "Вхід успішний. Завантажуємо адмінку…";
    showAdminContent();

    // Пароль очищаємо лише ПІСЛЯ успішної авторизації.
    productsAuthPassword.value = "";

    await initializeAdminProducts();
  } catch (error) {
    console.error("Критична помилка входу:", error);
    productsAuthMessage.textContent = `Помилка підключення: ${error.message || error}`;
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

adminLogoutButton.addEventListener("click", async () => {
  const client = getProductsAuthClient();

  await client.auth.signOut();

  adminProducts = [];
  showAdminLogin();
});
let adminProducts = [];
let uploadedImageData = "";
let uploadedImagesData = [];

function adminImage(src) {
  if (!src) return "../images/products/placeholder.svg";
  return /^(data:|https?:|\.\.\/)/.test(src) ? src : `../${src}`;
}

const productForm = document.getElementById("product-form");
const productIdInput = document.getElementById("product-id");
const nameInput = document.getElementById("name");
const articleInput = document.getElementById("article");
const categoryInput = document.getElementById("category");
const typeInput = document.getElementById("type");
const priceInput = document.getElementById("price");
const oldPriceInput = document.getElementById("old-price");
const imageFileInput = document.getElementById("image-file");
const imageUrlInput = document.getElementById("image-url");
const imagePreview = document.getElementById("image-preview");
const descriptionInput = document.getElementById("description");
const badgeInput = document.getElementById("badge");
const colorInput = document.getElementById("color");
const sortOrderInput = document.getElementById("sort-order");
const imagePreviews = document.getElementById("image-previews");
const sizesInput = document.getElementById("sizes");
const braSizesInput = document.getElementById("bra-sizes");
const pantiesSizesInput = document.getElementById("panties-sizes");
const regularSizesPanel = document.getElementById("regular-sizes-panel");
const lingerieSizesPanel = document.getElementById("lingerie-sizes-panel");
const adminProductsContainer = document.getElementById("admin-products");
const productCount = document.getElementById("product-count");
const formTitle = document.getElementById("form-title");
const resetFormButton = document.getElementById("reset-form");
const restoreDefaultsButton = document.getElementById("restore-defaults");
const adminProductSearch = document.getElementById("admin-product-search");
const adminProductSort = document.getElementById("admin-product-sort");

const categoryNames = {
  women: "Жіночий одяг",
  men: "Чоловічий одяг",
  "women-shoes": "Жіноче взуття",
  "men-shoes": "Чоловіче взуття",
  lingerie: "Жіноча білизна"
};

function parseSizes(value) {
  const result = {};
  value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .forEach(item => {
      const [size, quantity] = item.split(":").map(part => part.trim());

      if (size) {
        result[size] = Math.max(0, Number(quantity) || 0);
      }
    });

  return result;
}

function stringifySizes(sizes) {
  return Object.entries(sizes || {})
    .map(([size, quantity]) => `${size}:${quantity}`)
    .join(", ");
}



function totalStock(product) {
  const groups = product.type === "lingerie"
    ? [product.braSizes || {}, product.pantiesSizes || {}]
    : [product.sizes || {}];

  return groups.reduce(
    (sum, group) => sum + Object.values(group).reduce((part, qty) => part + Number(qty || 0), 0),
    0
  );
}

function renderAdminProducts() {
  adminProductsContainer.innerHTML = "";
  productCount.textContent = `${adminProducts.length} товарів`;

  const query = (adminProductSearch?.value || "").trim().toLowerCase();
  const sort = adminProductSort?.value || "catalog";

  let list = adminProducts.filter(product =>
    [product.name, product.article, product.color, product.categoryName]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  list = [...list];
  if (sort === "catalog") list.sort((a, b) => Number(a.sortOrder ?? a.id) - Number(b.sortOrder ?? b.id) || Number(a.id) - Number(b.id));
  if (sort === "newest") list.sort((a, b) => Number(b.id) - Number(a.id));
  if (sort === "name") list.sort((a, b) => String(a.name).localeCompare(String(b.name), "uk"));
  if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));

  list.forEach(product => {
    const row = document.createElement("article");
    row.className = "admin-product";
    const stock = totalStock(product);

    row.innerHTML = `
      <img src="${adminImage(product.image || (product.images && product.images[0]))}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>${product.categoryName} · ${product.article || "без артикула"}</p>
        <p>${product.color ? `Колір: ${product.color} · ` : ""}Залишок: ${stock} шт. · Позиція: ${Number(product.sortOrder ?? product.id)}</p>
        <strong>${Number(product.price).toLocaleString("uk-UA")} грн</strong>
      </div>
      <div class="product-actions">
        <button type="button" data-edit="${product.id}">Редагувати</button>
        <button class="danger" type="button" data-delete="${product.id}">Видалити</button>
      </div>
    `;

    adminProductsContainer.appendChild(row);
  });

  if (!list.length) {
    adminProductsContainer.innerHTML = '<p class="admin-empty">Товарів за цим пошуком не знайдено.</p>';
  }

  document.querySelectorAll("[data-edit]").forEach(button => {
    button.addEventListener("click", () => editProduct(Number(button.dataset.edit)));
  });

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteProduct(Number(button.dataset.delete)));
  });
}

function updateTypePanels() {
  const isLingerie = typeInput.value === "lingerie";
  regularSizesPanel.hidden = isLingerie;
  lingerieSizesPanel.hidden = !isLingerie;
}

function showPreview(src) {
  showPreviews(src ? [src] : []);
}

function showPreviews(images) {
  const list = (images || []).filter(Boolean);
  imagePreviews.innerHTML = "";

  if (!list.length) {
    imagePreview.classList.remove("visible");
    imagePreview.removeAttribute("src");
    imagePreviews.appendChild(imagePreview);
    return;
  }

  list.forEach((src, index) => {
    const img = index === 0 ? imagePreview : document.createElement("img");
    img.className = "image-preview visible";
    img.alt = index === 0 ? "Головне фото" : `Фото ${index + 1}`;
    img.src = adminImage(src);
    imagePreviews.appendChild(img);
  });
}

function compressImageFile(file, maxSide = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Не вдалося прочитати фото."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Не вдалося відкрити фото."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const scale = Math.min(1, maxSide / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  uploadedImageData = "";
  uploadedImagesData = [];
  imageUrlInput.value = "";
  formTitle.textContent = "Додати товар";
  typeInput.value = "clothes";
  sortOrderInput.value = adminProducts.length ? Math.max(...adminProducts.map(item => Number(item.sortOrder ?? item.id ?? 0))) + 1 : 1;
  updateTypePanels();
  showPreview("");
}

function editProduct(productId) {
  const product = adminProducts.find(item => item.id === productId);
  if (!product) return;

  productIdInput.value = product.id;
  nameInput.value = product.name || "";
  articleInput.value = product.article || "";
  categoryInput.value = product.category || "women";
  typeInput.value = product.type || "clothes";
  priceInput.value = product.price || 0;
  oldPriceInput.value = product.oldPrice || "";
  descriptionInput.value = product.description || "";
  badgeInput.value = product.badge || "";
  colorInput.value = product.color || "";
  sortOrderInput.value = Number(product.sortOrder ?? product.id ?? 0);
  imageUrlInput.value = product.image || "";
  uploadedImagesData = Array.isArray(product.images) && product.images.length ? [...product.images] : (product.image ? [product.image] : []);
  uploadedImageData = uploadedImagesData[0] || product.image || "";

  sizesInput.value = stringifySizes(product.sizes);
  braSizesInput.value = stringifySizes(product.braSizes);
  pantiesSizesInput.value = stringifySizes(product.pantiesSizes);

  formTitle.textContent = "Редагувати товар";
  updateTypePanels();
  showPreviews(uploadedImagesData);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteProduct(productId) {
  const product = adminProducts.find(item => item.id === productId);
  if (!product) return;

  if (!confirm(`Видалити товар «${product.name}»?`)) return;

  try {
    await window.velaroAdminApi.deleteProduct(productId);

    adminProducts = adminProducts.filter(item => item.id !== productId);

    renderAdminProducts();
    resetForm();

    alert("Товар успішно видалено.");
  } catch (error) {
    console.error(error);
    alert("Не вдалося видалити товар із Supabase.");
  }
}

imageFileInput.addEventListener("change", async () => {
  const files = Array.from(imageFileInput.files || []).slice(0, 4);

  if (!files.length) {
    uploadedImageData = "";
    uploadedImagesData = [];
    return;
  }

  try {
    imageFileInput.disabled = true;
    uploadedImagesData = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const data = await compressImageFile(file);
      uploadedImagesData.push(data);
    }

    uploadedImageData = uploadedImagesData[0] || "";
    imageUrlInput.value = "";
    showPreviews(uploadedImagesData);
  } catch (error) {
    console.error(error);
    alert(error.message || "Не вдалося підготувати фото.");
    uploadedImageData = "";
    uploadedImagesData = [];
    imageFileInput.value = "";
  } finally {
    imageFileInput.disabled = false;
  }
});

imageUrlInput.addEventListener("input", () => {
  if (imageUrlInput.value.trim()) {
    uploadedImageData = "";
    uploadedImagesData = [imageUrlInput.value.trim()];
    showPreviews(uploadedImagesData);
  }
});

typeInput.addEventListener("change", updateTypePanels);

productForm.addEventListener("submit", async event => {
  event.preventDefault();

  const editingId = Number(productIdInput.value);

  const image =
    uploadedImageData ||
    imageUrlInput.value.trim() ||
    "../images/products/placeholder.svg";

  const images = uploadedImagesData.length
    ? uploadedImagesData
    : [image];

  const product = {
    name: nameInput.value.trim(),
    article: articleInput.value.trim(),
    category: categoryInput.value,
    categoryName: categoryNames[categoryInput.value],
    type: typeInput.value,
    price: Number(priceInput.value),
    oldPrice: oldPriceInput.value
      ? Number(oldPriceInput.value)
      : null,
    image,
    images,
    description: descriptionInput.value.trim(),
    badge: badgeInput.value.trim(),
    color: colorInput.value.trim(),
    sortOrder: Number(sortOrderInput.value || 0),
    sizes: {},
    braSizes: {},
    pantiesSizes: {}
  };

  if (product.type === "lingerie") {
    product.braSizes = parseSizes(braSizesInput.value);
    product.pantiesSizes = parseSizes(pantiesSizesInput.value);
  } else {
    product.sizes = parseSizes(sizesInput.value);
  }

  const submitButton = productForm.querySelector('[type="submit"]');
  const originalButtonText = submitButton
    ? submitButton.textContent
    : "";

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Збереження...";
    }

    if (editingId) {
      const updatedProduct =
        await window.velaroAdminApi.updateProduct(
          editingId,
          product
        );

      adminProducts = adminProducts.map(item =>
        item.id === editingId ? updatedProduct : item
      );
    } else {
      const createdProduct =
        await window.velaroAdminApi.createProduct(product);

      adminProducts.push(createdProduct);
    }

    adminProducts.sort(
      (a, b) => Number(a.id) - Number(b.id)
    );

    renderAdminProducts();
    resetForm();

    alert(
      editingId
        ? "Товар оновлено."
        : "Товар додано."
    );
  } catch (error) {
    console.error("Помилка збереження товару:", error);

    const rawMessage = error.message || "невідома помилка";
    const friendlyMessage = rawMessage.includes("duplicate key value violates unique constraint")
      ? "У Supabase збилась автонумерація ID товарів. Запустіть файл supabase/FIX-PRODUCT-ID.sql один раз у SQL Editor, потім повторіть збереження."
      : rawMessage;

    alert(`Не вдалося зберегти товар: ${friendlyMessage}`);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
});

resetFormButton.addEventListener("click", resetForm);

restoreDefaultsButton.addEventListener("click", () => {
  if (!confirm("Повернути стандартні тестові товари? Поточні зміни буде втрачено.")) return;

  adminProducts = structuredClone(DEFAULT_PRODUCTS);
  saveProducts();
  renderAdminProducts();
  resetForm();
});

adminProductSearch?.addEventListener("input", renderAdminProducts);
adminProductSort?.addEventListener("change", renderAdminProducts);

async function initializeAdminProducts() {
  updateTypePanels();

  productCount.textContent = "Завантаження товарів...";

  try {
    adminProducts = await window.velaroAdminApi.loadProducts();
    renderAdminProducts();
  } catch (error) {
    console.error(error);

    productCount.textContent = "Помилка";

    adminProductsContainer.innerHTML =
      "<p>Не вдалося завантажити товари із Supabase.</p>";

    alert("Не вдалося підключитися до Supabase.");
  }
}

checkProductsAuth();


// ===== Замовлення VELARO =====
const statusNames={new:"Нове",processing:"В обробці",sent:"Відправлено",completed:"Виконано",cancelled:"Скасовано"};
let adminOrders=[]; let adminPassword=sessionStorage.getItem("velaroAdminPassword")||"";
const loginBox=document.getElementById("admin-login"),dashboard=document.getElementById("orders-dashboard"),ordersList=document.getElementById("orders-list");
function localOrders(){try{return JSON.parse(localStorage.getItem("velaroOrdersV1")||"[]")}catch{return[]}}
async function loadOrders(){
  const msg=document.getElementById("admin-login-message"); msg.textContent="Завантаження…";
  try{const r=await fetch("/api/admin-orders",{headers:{"x-admin-password":adminPassword}});if(!r.ok)throw new Error("auth");adminOrders=(await r.json()).orders||[];msg.textContent="";loginBox.hidden=true;dashboard.hidden=false;renderOrders();}
  catch(e){const local=localOrders();if(local.length){adminOrders=local;msg.textContent="API ще не підключене — показано локальні замовлення.";loginBox.hidden=true;dashboard.hidden=false;renderOrders();}else{msg.textContent="Невірний пароль або API/Supabase ще не налаштовано.";loginBox.hidden=false;dashboard.hidden=true;}}
}
function renderOrders(){
 const q=document.getElementById("orders-search").value.toLowerCase(), f=document.getElementById("orders-filter").value;
 const list=adminOrders.filter(o=>(f==="all"||o.status===f)&&[o.order_number,o.customer_name,o.customer?.name,o.customer_phone,o.customer?.phone].join(" ").toLowerCase().includes(q));
 const total=adminOrders.reduce((s,o)=>s+Number(o.total||0),0), fresh=adminOrders.filter(o=>o.status==="new").length;
 document.getElementById("order-stats").innerHTML=`<article><strong>${adminOrders.length}</strong><span>Усього</span></article><article><strong>${fresh}</strong><span>Нових</span></article><article><strong>${total.toLocaleString("uk-UA")} грн</strong><span>Сума</span></article>`;
 ordersList.innerHTML=list.length?list.map(o=>{const name=o.customer_name||o.customer?.name||"—",phone=o.customer_phone||o.customer?.phone||"—",method=o.delivery_method||o.delivery?.method||"—",items=o.items||[];return `<article class="order-card ${o.is_new?'is-new':''}"><div class="order-head"><div><strong>${o.order_number}</strong><span>${new Date(o.created_at).toLocaleString("uk-UA")}</span></div><select data-order-status="${o.id}">${Object.entries(statusNames).map(([k,v])=>`<option value="${k}" ${o.status===k?'selected':''}>${v}</option>`).join("")}</select></div><div class="order-customer"><b>${name}</b><a href="tel:${phone}">${phone}</a><span>${method} · ${(o.delivery_city||o.delivery?.city||"")} ${(o.delivery_branch||o.delivery?.branch||"")}</span></div><ul>${items.map(i=>`<li>${i.name} × ${i.quantity} <b>${Number(i.price*i.quantity).toLocaleString("uk-UA")} грн</b></li>`).join("")}</ul><div class="order-total">Разом: <strong>${Number(o.total).toLocaleString("uk-UA")} грн</strong></div></article>`}).join(""):"<p>Замовлень не знайдено.</p>";
 document.querySelectorAll("[data-order-status]").forEach(s=>s.onchange=()=>changeOrderStatus(s.dataset.orderStatus,s.value));
}
async function changeOrderStatus(id,status){
 const local=localOrders(),idx=local.findIndex(o=>String(o.id)===String(id));if(idx>=0){local[idx].status=status;local[idx].is_new=false;localStorage.setItem("velaroOrdersV1",JSON.stringify(local));adminOrders=local;renderOrders();return;}
 try{await fetch("/api/order-status",{method:"PATCH",headers:{"Content-Type":"application/json","x-admin-password":adminPassword},body:JSON.stringify({id,status})});await loadOrders();}catch{alert("Не вдалося змінити статус.")}
}
document.getElementById("admin-login-button").onclick=()=>{adminPassword=document.getElementById("admin-password").value;sessionStorage.setItem("velaroAdminPassword",adminPassword);loadOrders()};
document.getElementById("orders-refresh").onclick=loadOrders;document.getElementById("orders-search").oninput=renderOrders;document.getElementById("orders-filter").onchange=renderOrders;if(adminPassword)loadOrders();
