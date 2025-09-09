import products from "../api/available-products.json";
import { updateCartCount, updateWishlistCount } from "../common";
import { renderProducts } from "./renderAllProducts";

// Get product ID from URL
const params = new URLSearchParams(window.location.search);

const productId = parseInt(params.get("id"));

const product = products.find((product) => product.id === productId);

// Populate product details
if (product) {
  document.getElementById("productImage").src = product.image;
  document.getElementById("productImage").alt = product.name;
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productDescription").textContent = product.excerpt;
  document.getElementById(
    "productPrice"
  ).textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("productStock").textContent = product.stock;
  document.getElementById("innerPageListActive").textContent = product.name;
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productDescTabs").textContent = product.description;
  document.getElementById("innerPageListActive").textContent = product.name;
  document.getElementById(
    "userRating"
  ).textContent = `⭐ ${product.customerRating}`;
  const actualProductPrice = document.querySelector("#actualProductPrice");
  if (product.category === "Pots and Planters") {
    actualProductPrice.textContent = `$${
      Math.round((product.price + product.price * 0.25) * 100) / 100
    }`;
  } else if (product.category === "Garden Tools") {
    actualProductPrice.textContent = `$${
      Math.round((product.price + product.price * 0.1) * 100) / 100
    }`;
  } else if (product.category === "Garden Carts") {
    actualProductPrice.textContent = `$${
      Math.round((product.price + product.price * 0.3) * 100) / 100
    }`;
  } else {
    actualProductPrice.textContent = "";
  }
}

// Quantity control

let quantity = 1;
let totalSelectedProductPrice = product.price;
const quantityInput = document.getElementById("productQty");
const increaseBtn = document.getElementById("increaseQty");
const decreaseBtn = document.getElementById("decreaseQty");

increaseBtn.addEventListener("click", () => {
  if (quantity < product.stock) {
    quantity++;
    quantityInput.value = quantity;
    totalSelectedProductPrice = quantity * product.price;
    console.log(totalSelectedProductPrice);
  }
});

decreaseBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityInput.value = quantity;
    totalSelectedProductPrice = quantity * product.price;
    // console.log(totalSelectedProductPrice);
  }
});

// Add to Cart functionality

document.getElementById("addToCart").addEventListener("click", () => {
  addToCartFn(product.id);
});

export function addToCartFn(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProductID = cart.findIndex((item) => item.id === id);
  let toastMessage = "";
  let toastClass = "";

  if (existingProductID > -1) {
    cart[existingProductID].quantity = quantity;
    cart[existingProductID].totalProductPrice = totalSelectedProductPrice;
    if (cart[existingProductID].quantity > product.stock) {
      cart[existingProductID].quantity = product.stock;
    }
    toastMessage = `🔄 ${product.name} quantity updated in the cart!`;
    toastClass = "text-bg-info";
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity,
      totalProductPrice: Math.round(totalSelectedProductPrice * 100) / 100,
    });
    toastMessage = `✅ ${product.name} added to the cart!`;
    toastClass = "text-bg-success";
  }
  //   console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  const toastEl = document.getElementById("cartToast");
  toastEl.className = `toast align-items-center border-0 ${toastClass}`;
  document.getElementById("cartToastBody").textContent = toastMessage;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// renderProducts(
//   "relatedProductContainer",
//   (prod) => prod.category === product.category && prod.id !== product.id
// );

renderProducts(
  "relatedProductContainer",
  (prod) => prod.category === product.category
);

// Wishlist functionality
function updateWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isInWishlist = wishlist.some(item => item.id === product.id);
  
  const wishIcon = document.querySelector(".wishIcon i");
  const wishText = document.querySelector("#addToWishList span:last-child");
  
  if (isInWishlist) {
    wishIcon.className = "bi bi-heart-fill";
    wishIcon.style.color = "#e74c3c";
    wishText.textContent = "Added to Wishlist";
  } else {
    wishIcon.className = "bi bi-heart";
    wishIcon.style.color = "";
    wishText.textContent = "Add to Wishlist";
  }
}

// Initialize wishlist UI on page load
updateWishlistUI();

// Add to Wishlist functionality
document.getElementById("addToWishList").addEventListener("click", (e) => {
  e.preventDefault();
  
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const existingIndex = wishlist.findIndex(item => item.id === product.id);
  
  let toastMessage = "";
  let toastClass = "";
  
  if (existingIndex > -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1);
    toastMessage = `💔 ${product.name} removed from wishlist!`;
    toastClass = "text-bg-warning";
  } else {
    // Add to wishlist
    wishlist.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
      quantity: 1,
    });
    toastMessage = `❤️ ${product.name} added to wishlist!`;
    toastClass = "text-bg-success";
  }
  
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  updateWishlistUI();
  
  // Show toast
  const toastEl = document.getElementById("wishToast");
  toastEl.className = `toast align-items-center border-0 ${toastClass}`;
  document.getElementById("wishToastBody").textContent = toastMessage;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
});
