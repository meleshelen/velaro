let cart = loadCart();
let activeCategory = "lingerie";
let searchQuery = "";
let sortMode = "default";
let activeProduct = null;
let selectedRegularSize = "";
let selectedBraSize = "";
let selectedPantiesSize = "";

const productsGrid = document.getElementById("products-grid");
const productsEmpty = document.getElementById("products-empty");
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const closeCartButton = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");
const orderForm = document.getElementById("order-form");
const customerNameInput = document.getElementById("customer-name");
const customerPhoneInput = document.getElementById("customer-phone");
const deliveryMethodSelect = document.getElementById("delivery-method");
const deliveryCityGroup = document.getElementById("delivery-city-group");
const deliveryBranchGroup = document.getElementById("delivery-branch-group");
const deliveryCityInput = document.getElementById("delivery-city");
const deliveryBranchInput = document.getElementById("delivery-branch");
const deliveryBranchLabel = document.getElementById("delivery-branch-label");
const customerCommentInput = document.getElementById("customer-comment");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sort-select");
const searchToggle = document.getElementById("search-toggle");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("search-input");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mainNav = document.getElementById("main-nav");

const productModal = document.getElementById("product-modal");
const closeProductButton = document.getElementById("close-product");
const modalImage = document.getElementById("product-modal-image");
const productGallery = document.getElementById("product-gallery");
const modalCategory = document.getElementById("product-modal-category");
const modalTitle = document.getElementById("product-modal-title");
const modalArticle = document.getElementById("product-modal-article");
const modalDescription = document.getElementById("product-modal-description");
const modalPrice = document.getElementById("product-modal-price");
const regularSizeBlock = document.getElementById("regular-size-block");
const regularSizeOptions = document.getElementById("regular-size-options");
const braSizeBlock = document.getElementById("bra-size-block");
const braSizeOptions = document.getElementById("bra-size-options");
const pantiesSizeBlock = document.getElementById("panties-size-block");
const pantiesSizeOptions = document.getElementById("panties-size-options");
const modalAddToCart = document.getElementById("modal-add-to-cart");

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("velaroCart"));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("velaroCart", JSON.stringify(cart));
}

function formatPrice(price) {
  return `${Number(price).toLocaleString("uk-UA")} грн`;
}

function getVisibleProducts() {
  let list = [...products];

  if (activeCategory !== "all") {
    list = list.filter(product => product.category === activeCategory);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();

    list = list.filter(product => {
      const haystack = [
        product.name,
        product.article,
        product.categoryName,
        product.description
      ].join(" ").toLowerCase();

      return haystack.includes(query);
    });
  }

  if (sortMode === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sortMode === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  }

  if (sortMode === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name, "uk"));
  }

  return list;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productsGrid.innerHTML = "";
  productsEmpty.hidden = visibleProducts.length > 0;

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <button class="product-image-button" type="button" data-open-product="${product.id}">
        <img class="product-image" src="${product.image || (product.images && product.images[0])}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      </button>

      <div class="product-info">
        <p class="product-category">${product.categoryName}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-article">Артикул: ${product.article || "—"}</p>

        <div class="product-bottom">
          <div>
            <span class="product-price">${formatPrice(product.price)}</span>
            ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ""}
          </div>

          <button class="quick-view-button" type="button" data-open-product="${product.id}">
            Обрати
          </button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });

  document.querySelectorAll("[data-open-product]").forEach(button => {
    button.addEventListener("click", () => {
      openProduct(Number(button.dataset.openProduct));
    });
  });
}

function renderSizeButtons(container, sizes, type) {
  container.innerHTML = "";

  const availableSizes = Object.entries(sizes || {})
    .filter(([, quantity]) => Number(quantity) > 0);

  availableSizes.forEach(([size]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "size-button";
    button.textContent = size;

    button.addEventListener("click", () => {
      container.querySelectorAll(".size-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      if (type === "regular") selectedRegularSize = size;
      if (type === "bra") selectedBraSize = size;
      if (type === "panties") selectedPantiesSize = size;
    });

    container.appendChild(button);
  });

  // Коли доступний лише один розмір, обираємо його автоматично.
  if (availableSizes.length === 1) {
    const onlyButton = container.querySelector(".size-button");
    onlyButton?.click();
  }
}

function openProduct(productId) {
  activeProduct = products.find(product => product.id === productId);

  if (!activeProduct) return;

  selectedRegularSize = "";
  selectedBraSize = "";
  selectedPantiesSize = "";

  const galleryImages = Array.isArray(activeProduct.images) && activeProduct.images.length
    ? activeProduct.images
    : [activeProduct.image];
  modalImage.src = galleryImages[0];
  modalImage.alt = activeProduct.name;
  productGallery.innerHTML = galleryImages.map((src, index) => `
    <button class="gallery-thumb ${index === 0 ? "active" : ""}" type="button" data-gallery-image="${src}">
      <img src="${src}" alt="${activeProduct.name}, фото ${index + 1}">
    </button>
  `).join("");
  productGallery.querySelectorAll("[data-gallery-image]").forEach(button => {
    button.addEventListener("click", () => {
      modalImage.src = button.dataset.galleryImage;
      productGallery.querySelectorAll(".gallery-thumb").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
  modalCategory.textContent = activeProduct.categoryName;
  modalTitle.textContent = activeProduct.name;
  modalArticle.textContent = `Артикул: ${activeProduct.article || "—"}`;
  modalDescription.textContent = activeProduct.description || "";
  modalPrice.innerHTML = `
    ${formatPrice(activeProduct.price)}
    ${activeProduct.oldPrice ? `<span class="old-price">${formatPrice(activeProduct.oldPrice)}</span>` : ""}
  `;

  const isLingerie = activeProduct.type === "lingerie";

  regularSizeBlock.style.display = isLingerie ? "none" : "block";
  braSizeBlock.style.display = isLingerie ? "block" : "none";
  pantiesSizeBlock.style.display = isLingerie ? "block" : "none";

  if (isLingerie) {
    renderSizeButtons(braSizeOptions, activeProduct.braSizes, "bra");
    renderSizeButtons(pantiesSizeOptions, activeProduct.pantiesSizes, "panties");
  } else {
    renderSizeButtons(regularSizeOptions, activeProduct.sizes, "regular");
  }

  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeProduct() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");

  if (!cartModal.classList.contains("open")) {
    document.body.classList.remove("no-scroll");
  }
}

function addActiveProductToCart() {
  if (!activeProduct) return;

  if (activeProduct.type === "lingerie") {
    if (!selectedBraSize || !selectedPantiesSize) {
      alert("Оберіть розмір чашки та розмір трусиків.");
      return;
    }
  } else if (!selectedRegularSize) {
    alert("Оберіть розмір.");
    return;
  }

  const variantKey = activeProduct.type === "lingerie"
    ? `${selectedBraSize}|${selectedPantiesSize}`
    : selectedRegularSize;

  const existing = cart.find(item =>
    item.productId === activeProduct.id &&
    item.variantKey === variantKey
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: activeProduct.id,
      variantKey,
      name: activeProduct.name,
      article: activeProduct.article,
      image: activeProduct.image,
      price: activeProduct.price,
      quantity: 1,
      size: activeProduct.type === "lingerie" ? "" : selectedRegularSize,
      braSize: activeProduct.type === "lingerie" ? selectedBraSize : "",
      pantiesSize: activeProduct.type === "lingerie" ? selectedPantiesSize : ""
    });
  }

  saveCart();
  updateCart();
  closeProduct();
  openCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty">Ваш кошик поки що порожній.</div>`;
    orderForm.classList.remove("open");
    checkoutButton.textContent = "Оформити замовлення";
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const variantText = item.braSize
      ? `Чашка: ${item.braSize}; трусики: ${item.pantiesSize}`
      : `Розмір: ${item.size}`;

    row.innerHTML = `
      <img class="cart-item-image" src="${item.image}" alt="${item.name}">

      <div>
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-meta">${variantText}</p>
        <p class="cart-item-price">${formatPrice(item.price)}</p>

        <div class="quantity-control">
          <button type="button" data-cart-action="decrease" data-key="${item.productId}::${item.variantKey}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-action="increase" data-key="${item.productId}::${item.variantKey}">+</button>
        </div>
      </div>

      <button class="remove-item" type="button" data-cart-action="remove" data-key="${item.productId}::${item.variantKey}" aria-label="Видалити">×</button>
    `;

    cartItems.appendChild(row);
  });

  document.querySelectorAll("[data-cart-action]").forEach(button => {
    button.addEventListener("click", () => {
      changeCart(button.dataset.key, button.dataset.cartAction);
    });
  });
}

function changeCart(key, action) {
  const [productIdText, variantKey] = key.split("::");
  const productId = Number(productIdText);
  const item = cart.find(entry => entry.productId === productId && entry.variantKey === variantKey);

  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity -= 1;

  if (action === "remove" || item.quantity <= 0) {
    cart = cart.filter(entry => !(entry.productId === productId && entry.variantKey === variantKey));
  }

  saveCart();
  updateCart();
}

function openCart() {
  cartModal.classList.add("open");
  cartModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartModal.classList.remove("open");
  cartModal.setAttribute("aria-hidden", "true");

  if (!productModal.classList.contains("open")) {
    document.body.classList.remove("no-scroll");
  }
}

function updateDeliveryFields() {
  const method = deliveryMethodSelect.value;
  const isPickup = method === "Самовивіз";
  const needsBranch = method === "Нова пошта" || method === "Укрпошта";

  deliveryCityGroup.style.display = isPickup ? "none" : "grid";
  deliveryBranchGroup.style.display = isPickup ? "none" : "grid";
  deliveryCityInput.required = needsBranch;
  deliveryBranchInput.required = needsBranch;

  if (method === "Нова пошта") {
    deliveryBranchLabel.textContent = "Номер відділення або поштомату";
    deliveryBranchInput.placeholder = "Наприклад, відділення №12";
  } else if (method === "Укрпошта") {
    deliveryBranchLabel.textContent = "Поштовий індекс або відділення";
    deliveryBranchInput.placeholder = "Наприклад, 69000";
  } else {
    deliveryBranchLabel.textContent = "Номер відділення";
    deliveryBranchInput.placeholder = "Вкажіть відділення";
  }
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^\+?380\d{9}$/.test(cleaned);
}

function createOrderText() {
  const lines = cart.map((item, index) => {
    const variant = item.braSize
      ? `Чашка: ${item.braSize}; трусики: ${item.pantiesSize}`
      : `Розмір: ${item.size}`;

    return `${index + 1}. ${item.name}
${variant}
Кількість: ${item.quantity}
Сума: ${formatPrice(item.price * item.quantity)}`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const method = deliveryMethodSelect.value;

  let delivery = `Доставка: ${method}`;

  if (method === "Нова пошта" || method === "Укрпошта") {
    delivery += `\nМісто: ${deliveryCityInput.value.trim()}\nВідділення: ${deliveryBranchInput.value.trim()}`;
  }

  if (method === "Самовивіз") {
    delivery += "\nМісце: Запоріжжя, Хортицький район";
  }

  return `НОВЕ ЗАМОВЛЕННЯ VELARO

Покупець: ${customerNameInput.value.trim()}
Телефон: ${customerPhoneInput.value.trim()}
${delivery}

ТОВАРИ:

${lines.join("\n\n")}

РАЗОМ: ${formatPrice(total)}
${customerCommentInput.value.trim() ? `\nКоментар: ${customerCommentInput.value.trim()}` : ""}`;
}

function buildOrderPayload() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    customer: {
      name: customerNameInput.value.trim(),
      phone: customerPhoneInput.value.trim()
    },
    delivery: {
      method: deliveryMethodSelect.value,
      city: deliveryCityInput.value.trim(),
      branch: deliveryBranchInput.value.trim()
    },
    comment: customerCommentInput.value.trim(),
    items: cart.map(item => ({ ...item })),
    total,
    source: "velaro-web"
  };
}

function createLocalOrder(payload) {
  const key = "velaroOrdersV1";
  const orders = JSON.parse(localStorage.getItem(key) || "[]");
  const next = Number(localStorage.getItem("velaroOrderCounter") || "0") + 1;
  localStorage.setItem("velaroOrderCounter", String(next));
  const order = {
    id: `local-${Date.now()}`,
    order_number: `VLR-${String(next).padStart(6, "0")}`,
    status: "new",
    is_new: true,
    created_at: new Date().toISOString(),
    ...payload
  };
  orders.unshift(order);
  localStorage.setItem(key, JSON.stringify(orders));
  return order;
}

function showOrderSuccess(orderNumber) {
  document.getElementById("success-order-number").textContent = orderNumber;
  document.getElementById("success-modal").classList.add("open");
  document.getElementById("success-modal").setAttribute("aria-hidden", "false");
}

async function submitOrder(event) {
  event.preventDefault();
  if (cart.length === 0) return alert("Кошик порожній.");
  if (!isValidPhone(customerPhoneInput.value.trim())) {
    alert("Введіть телефон у форматі +380XXXXXXXXX.");
    customerPhoneInput.focus();
    return;
  }

  const submitButton = orderForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Надсилаємо…";
  const payload = buildOrderPayload();
  let result;

  try {
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(responseData.error || "Не вдалося надіслати замовлення.");
    }

    result = responseData;
  } catch (error) {
    console.error("Помилка оформлення замовлення:", error);
    alert(`Замовлення не надіслано. ${error.message || "Спробуйте ще раз."}`);
    return;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Надіслати замовлення";
  }

  cart = [];
  saveCart();
  updateCart();
  orderForm.reset();
  orderForm.classList.remove("open");
  checkoutButton.textContent = "Оформити замовлення";
  closeCart();
  showOrderSuccess(result.order_number || result.orderNumber);
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderProducts();
    mainNav.classList.remove("open");
  });
});

sortSelect.addEventListener("change", () => {
  sortMode = sortSelect.value;
  renderProducts();
});

searchToggle.addEventListener("click", () => {
  searchPanel.classList.toggle("open");

  if (searchPanel.classList.contains("open")) {
    searchInput.focus();
  }
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  renderProducts();
});

mobileMenuButton.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

cartIcon.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
document.querySelector("[data-close-cart]").addEventListener("click", closeCart);

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Спочатку додайте товар у кошик.");
    return;
  }

  orderForm.classList.toggle("open");

  const isOpen = orderForm.classList.contains("open");

  checkoutButton.textContent = isOpen
    ? "Закрити форму"
    : "Оформити замовлення";

  if (isOpen) {
    setTimeout(() => {
      orderForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }
});

deliveryMethodSelect.addEventListener("change", updateDeliveryFields);
orderForm.addEventListener("submit", submitOrder);

closeProductButton.addEventListener("click", closeProduct);
document.querySelector("[data-close-product]").addEventListener("click", closeProduct);
modalAddToCart.addEventListener("click", addActiveProductToCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    closeProduct();
  }
});

window.addEventListener("storage", event => {
  if (event.key === "velaroProductsV31") {
    products = getProducts();
    renderProducts();
  }
});

async function initializeStorefront() {
  products = await loadProductsFromSupabase();

  renderProducts();
  updateCart();
  updateDeliveryFields();
}

initializeStorefront();


document.getElementById("success-close").addEventListener("click", () => {
  const modal = document.getElementById("success-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
});
