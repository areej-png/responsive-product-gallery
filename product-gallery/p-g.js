const products = [
  { id: 1, name: "Coffee Mug", price: 10, image: "./images-folder/Boulder-Mugs.jpeg" },
  { id: 2, name: "Headphones", price: 50, image: "./images-folder/download.jpeg" },
  { id: 3, name: "Backpack", price: 30, image: "./images-folder/bag.jpeg" },
];

let productList = document.getElementById("product-list");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render products
products.forEach(item => {
  let card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}"/>
    <h3>${item.name}</h3>
    <div class="price">$${item.price}</div>
    <button class="add-btn" data-id="${item.id}">Add to Cart</button>
  `;
  
  productList.appendChild(card);
});

// Update cart count in navbar
function updateCartCount() {
  let countEl = document.getElementById("cart-count"); 
  if (countEl) {
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countEl.innerText = totalItems;
  }
}
updateCartCount();

// Add to cart logic
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    let id = parseInt(btn.dataset.id);
    let product = products.find(p => p.id === id);

    // Check if product already in cart
    let existing = cart.find(p => p.id === id);
    if (existing) {
      alert(product.name + " is already in cart!");
    } else {
      // Save with $price string for consistency
      cart.push({ ...product });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart!");
      updateCartCount();
    }
  });
});

