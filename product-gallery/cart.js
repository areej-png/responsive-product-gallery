const products = [
  { id: 1, name: "Coffee Mug", price: 10, stock: 5, image: "./images-folder/Boulder-Mugs.jpeg" },
  { id: 2, name: "Headphones", price: 50, stock: 3, image: "./images-folder/download.jpeg" },
  { id: 3, name: "Backpack", price: 30, stock: 0, image: "./images-folder/bag.jpeg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discountApplied = false;
let discountPercent = 0;

const discountCodes = {
  "SAVE20": 20,
  "FIRST10": 10,
  "WELCOME15": 15,
  "SUPER25": 25
};

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 5;

let cartItemsContainer = document.getElementById("cart-items");
let emptyCartMessage = document.getElementById("empty-cart-message");
let subtotalEl = document.getElementById("subtotal");
let discountAmountEl = document.getElementById("discount-amount");
let shippingCostEl = document.getElementById("shipping-cost");
let cartTotalEl = document.getElementById("cart-total");
let cartCountEl = document.getElementById("cart-count");

function getProductStock(productId) {
  const product = products.find(p => p.id === productId);
  return product ? product.stock : 0;
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.style.display = "none";
    emptyCartMessage.style.display = "flex";
    emptyCartMessage.style.flexDirection = "column";
    emptyCartMessage.style.alignItems = "center";
    emptyCartMessage.style.padding = "40px";
    return;
  }

  cartItemsContainer.style.display = "block";
  emptyCartMessage.style.display = "none";
  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const maxStock = getProductStock(item.id);
    const isMaxQty = item.quantity >= maxStock;
    
    let div = document.createElement("div");
    div.classList.add("cart-item");
    
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="item-price">$${item.price}</p>
      </div>
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${index})">-</button>
        <span>${item.quantity || 1}</span>
        <button onclick="increaseQuantity(${index})" ${isMaxQty ? 'disabled class="disabled-btn"' : ''}>+</button>
      </div>
      <div class="item-total">
        $${(item.price * (item.quantity || 1)).toFixed(2)}
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    
    cartItemsContainer.appendChild(div);
  });

  updateTotals();
}

function increaseQuantity(index) {
  const item = cart[index];
  const maxStock = getProductStock(item.id);
  
  if (item.quantity >= maxStock) {
    alert("Sorry! Maximum available quantity reached.");
    return;
  }
  
  cart[index].quantity = (cart[index].quantity || 1) + 1;
  saveCart();
  renderCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    saveCart();
    renderCart();
  }
}

function removeFromCart(index) {
  if (confirm("Remove this item from cart?")) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  if (cartCountEl) {
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCountEl.innerText = totalItems;
  }
}

function updateTotals() {
  let subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * (item.quantity || 1));
  }, 0);

  let discount = discountApplied ? (subtotal * discountPercent / 100) : 0;
  let shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  let total = subtotal - discount + shipping;

  subtotalEl.innerText = "$" + subtotal.toFixed(2);
  discountAmountEl.innerText = discount > 0 ? "-$" + discount.toFixed(2) : "$0";
  shippingCostEl.innerText = shipping === 0 ? "FREE" : "$" + shipping.toFixed(2);
  cartTotalEl.innerHTML = "<strong>$" + total.toFixed(2) + "</strong>";

  let remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  let remainingAmountEl = document.getElementById("remaining-amount");
  let freeShippingMsg = document.getElementById("free-shipping-msg");
  
  if (remaining > 0) {
    remainingAmountEl.innerText = remaining.toFixed(2);
    freeShippingMsg.style.display = "block";
  } else {
    freeShippingMsg.style.display = "none";
  }
}

document.getElementById("apply-discount").addEventListener("click", () => {
  let code = document.getElementById("discount-input").value.toUpperCase().trim();
  let message = document.getElementById("discount-message");

  if (discountCodes[code]) {
    discountApplied = true;
    discountPercent = discountCodes[code];
    message.innerText = `✓ ${discountPercent}% discount applied!`;
    message.style.color = "#28a745";
    updateTotals();
  } else {
    message.innerText = "✗ Invalid discount code";
    message.style.color = "#e63946";
  }

  setTimeout(() => {
    message.innerText = "";
  }, 3000);
});

document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Proceeding to checkout... (Feature coming soon!)");
});

renderCart();
updateCartCount();