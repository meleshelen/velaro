let adminProducts = getProducts();
let uploadedImageData = "";

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

function saveProducts() {
  localStorage.setItem("velaroProductsV31", JSON.stringify(adminProducts));
}

function renderAdminProducts() {
  adminProductsContainer.innerHTML = "";
  productCount.textContent = `${adminProducts.length} товарів`;

  adminProducts.forEach(product => {
    const row = document.createElement("article");
    row.className = "admin-product";

    row.innerHTML = `
      <img src="${adminImage(product.image || (product.images && product.images[0]))}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>${product.categoryName} · ${product.article || "без артикула"}</p>
        <strong>${Number(product.price).toLocaleString("uk-UA")} грн</strong>
      </div>
      <div class="product-actions">
        <button type="button" data-edit="${product.id}">Редагувати</button>
        <button class="danger" type="button" data-delete="${product.id}">Видалити</button>
      </div>
    `;

    adminProductsContainer.appendChild(row);
  });

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
  if (!src) {
    imagePreview.classList.remove("visible");
    imagePreview.removeAttribute("src");
    return;
  }

  imagePreview.src = adminImage(src);
  imagePreview.classList.add("visible");
}

function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  uploadedImageData = "";
  imageUrlInput.value = "";
  formTitle.textContent = "Додати товар";
  typeInput.value = "clothes";
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
  imageUrlInput.value = product.image || "";
  uploadedImageData = product.image || "";

  sizesInput.value = stringifySizes(product.sizes);
  braSizesInput.value = stringifySizes(product.braSizes);
  pantiesSizesInput.value = stringifySizes(product.pantiesSizes);

  formTitle.textContent = "Редагувати товар";
  updateTypePanels();
  showPreview(product.image);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(productId) {
  const product = adminProducts.find(item => item.id === productId);
  if (!product) return;

  if (!confirm(`Видалити товар «${product.name}»?`)) return;

  adminProducts = adminProducts.filter(item => item.id !== productId);
  saveProducts();
  renderAdminProducts();
  resetForm();
}

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files[0];

  if (!file) {
    uploadedImageData = "";
    return;
  }

  if (file.size > 2_000_000) {
    alert("Фото завелике. Оберіть файл до 2 МБ.");
    imageFileInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    uploadedImageData = String(reader.result);
    imageUrlInput.value = "";
    showPreview(uploadedImageData);
  };

  reader.readAsDataURL(file);
});

imageUrlInput.addEventListener("input", () => {
  if (imageUrlInput.value.trim()) {
    uploadedImageData = "";
    showPreview(imageUrlInput.value.trim());
  }
});

typeInput.addEventListener("change", updateTypePanels);

productForm.addEventListener("submit", event => {
  event.preventDefault();

  const editingId = Number(productIdInput.value);
  const image = uploadedImageData || imageUrlInput.value.trim() || "../images/products/placeholder.svg";

  const product = {
    id: editingId || Date.now(),
    name: nameInput.value.trim(),
    article: articleInput.value.trim(),
    category: categoryInput.value,
    categoryName: categoryNames[categoryInput.value],
    type: typeInput.value,
    price: Number(priceInput.value),
    oldPrice: oldPriceInput.value ? Number(oldPriceInput.value) : null,
    image,
    images: [image],
    description: descriptionInput.value.trim(),
    badge: badgeInput.value.trim()
  };

  if (product.type === "lingerie") {
    product.braSizes = parseSizes(braSizesInput.value);
    product.pantiesSizes = parseSizes(pantiesSizesInput.value);
  } else {
    product.sizes = parseSizes(sizesInput.value);
  }

  if (editingId) {
    adminProducts = adminProducts.map(item => item.id === editingId ? product : item);
  } else {
    adminProducts.push(product);
  }

  saveProducts();
  renderAdminProducts();
  resetForm();
  alert(editingId ? "Товар оновлено." : "Товар додано.");
});

resetFormButton.addEventListener("click", resetForm);

restoreDefaultsButton.addEventListener("click", () => {
  if (!confirm("Повернути стандартні тестові товари? Поточні зміни буде втрачено.")) return;

  adminProducts = structuredClone(DEFAULT_PRODUCTS);
  saveProducts();
  renderAdminProducts();
  resetForm();
});

updateTypePanels();
renderAdminProducts();


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
