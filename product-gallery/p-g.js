const products = [
  { id: 1, name: "Coffee Mug", price: 10, stock: 5, image: "./images-folder/Boulder-Mugs.jpeg" },
  { id: 2, name: "Headphones", price: 50, stock: 9, image: "./images-folder/download.jpeg" },
  { id: 3, name: "Backpack", price: 30, stock: 10, image: "./images-folder/bag.jpeg" } 
];

let productList = document.getElementById("product-list");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Check if product can be added
function canAddToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(p => p.id === productId);
  const currentQty = cartItem ? cartItem.quantity : 0;
  return currentQty < product.stock;
}

// Get remaining stock for urgency message
function getRemainingStock(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(p => p.id === productId);
  const currentQty = cartItem ? cartItem.quantity : 0;
  return product.stock - currentQty;
}

// Render products
products.forEach(({ id, name, price, image, stock }) => {
  const card = document.createElement("div");
  card.classList.add("card");
  
  const remaining = getRemainingStock(id);
  const isOutOfStock = stock === 0 || remaining === 0;
  const showUrgency = remaining > 0 && remaining <= 3; // Show urgency when 3 or less items left
  
  card.innerHTML = `
    <img src="${image}" alt="${name}"/>
    <h3>${name}</h3>
    <div class="price">$${price}</div>
    ${showUrgency ? `<div class="stock-warning">Only ${remaining} left in stock!</div>` : ''}
    <button class="add-btn ${isOutOfStock ? 'sold-out' : ''}" 
            data-id="${id}" 
            ${isOutOfStock ? 'disabled' : ''}>
      ${isOutOfStock ? 'Sold Out' : 'Add to Cart'}
    </button>
  `;
  
  productList.appendChild(card);
});

// Update cart count
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// Update button state after adding to cart
function updateButtonState(productId) {
  const button = document.querySelector(`button[data-id="${productId}"]`);
  const card = button.closest('.card');
  const remaining = getRemainingStock(productId);
  
  // Remove old urgency message if exists
  const oldWarning = card.querySelector('.stock-warning');
  if (oldWarning) oldWarning.remove();
  
  if (remaining === 0) {
    button.innerText = "Sold Out";
    button.disabled = true;
    button.classList.add("sold-out");
  } else if (remaining <= 3) {
    // Add urgency message
    const urgencyMsg = document.createElement('div');
    urgencyMsg.className = 'stock-warning';
    urgencyMsg.innerText = `Only ${remaining} left in stock!`;
    button.parentNode.insertBefore(urgencyMsg, button);
  }
}

updateCartCount();

// Add to cart logic
productList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-btn") || e.target.disabled) return;

  const id = parseInt(e.target.dataset.id);
  const product = products.find(p => p.id === id);
  
  // Check stock availability
  if (!canAddToCart(id)) {
    alert("Sorry! This item is currently out of stock.");
    return;
  }

  const existing = cart.find(p => p.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  updateButtonState(id);
});