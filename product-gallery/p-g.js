const products = [
  { id: 1, name: "Coffee Mug", price: 10, image: "../images-folder/bag.jpeg" },
  { id: 2, name: "Headphones", price: 50, image: "../images-folder/download.jpeg" },
  { id: 3, name: "Backpack", price: 30, image: "../images-folder/bag.jpeg" },
];

let productList = document.getElementById("product-list");

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

// Cart logic
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    let id = parseInt(btn.dataset.id);
    let product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product.name + " added to cart!");
  });
});
