import products from "../api/available-products.json";
import { updateCartCount } from "../common";
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
