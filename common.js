// ================== HEADER & FOOTER IMPORT ================== //

// import { removeCartItem } from "./js/cart";

// fetch("../preloader.html")
//   .then((response) => response.text())
//   .then((data) => {
//     document.body.insertAdjacentHTML("afterbegin", data);

//     window.addEventListener("load", () => {
//       document.getElementById("preloader").classList.add("hidden");
//     });
//   });

// WOW.js is loaded via CDN in HTML, so we don't need to import it here
// The WOW initialization is handled in the HTML script tags

// Remove WOW import and initialization from here since it's handled in HTML

document.addEventListener("DOMContentLoaded", () => {
  // Hide preloader after DOM is ready
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 500); // half second delay for smooth fade
  }
});

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden");
  }
});

fetch("header.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
    updateCartCount(); // update cart after header is inserted
    //window.addEventListener("cartUpdated", updateCartCount);

    updateWishlistCount();
    searchProducts();
  });

fetch("footer.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;

    fetch("api/available-products.json")
      .then((response) => response.json())
      .then((products) => {
        const footerListPopular = document.getElementById("footerListPopular");
        let count = 0;
        products.forEach((productEl) => {
          if (productEl.bestSeller && count < 6) {
            const li = document.createElement("li");
            li.innerHTML = `<a href="product-details.html?id=${productEl.id}">${productEl.name}</a>`;
            footerListPopular.appendChild(li);
            count++;
          }
        });
      });
  });

// addToCart(id){

// }

// ================== CART FUNCTIONS ================== //
// function getCart() {
//   return JSON.parse(localStorage.getItem("cart")) || [];
// }

// function saveCart(cart) {
//   localStorage.setItem("cart", JSON.stringify(cart));
//   updateCartCount();
// }

export function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.length;
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = count;
  }
  const cartListOffcanvas = document.getElementById("cartListOffcanvas");
  const cartOffCanvasTemplate = document.getElementById(
    "cartOffCanvasTemplate"
  );
  const cartBtnGroup = document.getElementById("cartBtnGroup");
  cartListOffcanvas.innerHTML = "";
  cartBtnGroup.style.display = "block";
  if (cart.length === 0) {
    cartListOffcanvas.innerHTML =
      "<p class='empty-cart'>Your cart is empty.</p>";
    cartBtnGroup.style.display = "none";
  }
  if (cartListOffcanvas) {
    cart.forEach((cartItem) => {
      const clone = cartOffCanvasTemplate.content.cloneNode(true);
      clone.querySelector(".cart-item-image").src = cartItem.image;
      clone.querySelector(".cart-item-title").textContent = cartItem.name;
      clone.querySelector("#cartItemPriceValue").textContent = cartItem.price;
      clone.querySelector("#cartItemQuantity").textContent = cartItem.quantity;
      clone.querySelector(".btnRemove").addEventListener("click", () => {
        removeCartProduct(cartItem.id);
      });
      cartListOffcanvas.appendChild(clone);
    });
  }
}

export function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let count = wishlist.length;
  const wishlistCount = document.getElementById("wishlistCount");

  if (wishlistCount) {
    wishlistCount.textContent = count;
  }
}

export function removeCartProduct(id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  updateCartCount();
}

function searchProducts() {
  const autocompleteBox = document.getElementById("autocompleteBox");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const autocompleteList = document.getElementById("autocompleteList");
  const notFound = document.getElementById("notFound");
  notFound.textContent = "";
  // const noResultItem = document.createElement("p");

  let query = "";

  async function getProducts() {
    const response = await fetch(`api/available-products.json`);
    const data = await response.json();
    return data;
  }

  searchInput.addEventListener("keyup", async (e) => {
    query = e.target.value.toLowerCase();

    if (query.trim() !== "") {
      const products = await getProducts();
      autocompleteList.innerHTML = "";
      products.forEach((productEl) => {
        if (
          productEl.category.toLowerCase().includes(query) ||
          productEl.name.toLowerCase().includes(query)
        ) {
          notFound.textContent = "";
          const autoList = document.createElement("li");
          autoList.classList.add("autocom-list-item");
          autoList.textContent = productEl.name;
          autoList.addEventListener("click", () => {
            searchInput.value = productEl.name;
            autocompleteList.innerHTML = "";
            window.location.href = `products.html?category=${encodeURIComponent(
              productEl.category
            )}`;
          });
          autocompleteList.appendChild(autoList);
        }
      });
    }
  });

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = searchInput.value.toLowerCase();
    if (query.trim() !== "") {
      const products = await getProducts();
      // products.forEach((productEl) => {
      //   if (productEl.category.toLowerCase().includes(query)) {
      //     window.location.href = `products.html?category=${encodeURIComponent(
      //       productEl.category
      //     )}`;
      //   }
      // });
      notFound.textContent = "";
      let filteredProducts = products.filter((productEl) => {
        if (
          productEl.category.toLowerCase().includes(query) ||
          productEl.name.toLowerCase().includes(query)
        ) {
          window.location.href = `products.html?category=${encodeURIComponent(
            productEl.category
          )}`;
          return true;
        }
      });
      console.log(filteredProducts);
      if (filteredProducts.length === 0) {
        notFound.textContent = "Sorry, no results found.";
      }

      console.log(filteredProducts);
    } else {
      // Handle empty search query
      autocompleteList.innerHTML = "";
      const noResultItem = document.createElement("p");
      noResultItem.textContent = "Please enter a search term.";
      autocompleteList.appendChild(noResultItem);
    }
  });

  function performSearch(query) {
    // Implement search functionality here
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   const offcanvasSearch = document.getElementById("offcanvasSearch");
//   console.log(offcanvasSearch);

//   offcanvasSearch.addEventListener("shown.bs.offcanvas", () => {
//     const searchInput = document.getElementById("searchInput");
//     const autocompleteList = document.getElementById("autocompleteList");
//     console.log(searchInput);

//     // searchInput.addEventListener("keyup", (e) => {
//     //   const inputText = e.target.value;
//     //   console.log("inputText:", inputText);
//     // });
//   });
// });

// function addToCart(product) {
//   const cart = getCart();
//   const existing = cart.find((item) => item.id === product.id);
//   if (existing) {
//     existing.quantity += 1;
//   } else {
//     cart.push({ ...product, quantity: 1 });
//   }
//   saveCart(cart);
//   showToast(`${product.name} added to cart`);
// }

// function removeFromCart(productId) {
//   let cart = getCart();
//   cart = cart.filter((item) => item.id !== productId);
//   saveCart(cart);
//   showToast("Product removed from cart");
// }

// ================== TOAST MESSAGE ================== //
// function showToast(message) {
//   const toast = document.createElement("div");
//   toast.className = "toast-message";
//   toast.textContent = message;
//   document.body.appendChild(toast);

//   setTimeout(() => toast.classList.add("show"), 100);
//   setTimeout(() => {
//     toast.classList.remove("show");
//     toast.remove();
//   }, 3000);
// }

// ================== CROSS-TAB SYNC ================== //
// window.addEventListener("storage", (e) => {
//   if (e.key === "cart") {
//     updateCartCount();
//   }
// });
