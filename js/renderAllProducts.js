import products from "../api/available-products.json";
import { updateCartCount, updateWishlistCount } from "../common";
// import { addToCartFn } from "./product-details";

export function renderProducts(containerId, filterfn) {
  const container = document.getElementById(containerId);
  const productTem = document.getElementById("productTemplate");

  // Clear old items
  container.innerHTML = "";
  const filteredProducts = products.filter(filterfn);

  if (filteredProducts.length === 0) {
    container.innerHTML = `<h2 class="noProductFound">Sorry, no product is found at this range and category</h2>`;
    return;
  }

  filteredProducts.forEach((product) => {
    const productClone = productTem.content.cloneNode(true);

    const {
      id,
      name,
      image,
      description,
      category,
      price,
      stock,
      featured,
      bestSeller,
      customerRating,
      newArrival,
    } = product;

    productClone
      .querySelector("#productValue")
      .setAttribute("id", `product${id}`);

    productClone.querySelector(".productTitle").textContent = name;
    productClone.querySelector(".productImg").src = image;
    productClone.querySelector(".productImg").alt = name;
    productClone.querySelector(".productPrice").textContent = `$${price}`;
    const actualProductPrice = productClone.querySelector(
      ".ActualProductPrice"
    );
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

    productClone.querySelector(".rating").textContent = `⭐ ${customerRating}`;

    productClone.querySelector("#viewProduct").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `product-details.html?id=${id}`;
    });

    productClone.getElementById("product-img").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = `product-details.html?id=${id}`;
    });

    productClone.querySelector("#addWishList").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      //window.location.href = `wishList.html?id=${id}`;

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      const existingWishedPro = wishlist.findIndex(
        (wishItem) => wishItem.id === id
      );
      console.log("wishing...");

      let toastMessage = "";
      let toastClass = "";

      if (existingWishedPro > -1) {
        toastMessage = `🔄 ${name} is already in wish list`;
        toastClass = "text-bg-info";
      } else {
        toastMessage = `✅ ${name} added to the wishlist!`;
        toastClass = "text-bg-success";
        wishlist.push({
          id,
          image,
          name,
          stock,
          price,
          category,
          description,
          quantity: 1,
        });
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateWishlistCount();
      const toastEl = document.getElementById("wishToast");
      toastEl.className = `toast align-items-center border-0 ${toastClass}`;
      document.getElementById("wishToastBody").textContent = toastMessage;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    });

    productClone
      .querySelector("#addToCartBtn")
      .addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        //window.location.href = `cart.html`;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let toastMessage = "";
        let toastClass = "";

        const existingId = cart.findIndex((item) => item.id === id);
        if (existingId > -1) {
          toastMessage = `🔄 ${name} is already in cart`;
          toastClass = "text-bg-info";
        } else {
          cart.push({
            id,
            image,
            name,
            stock,
            price,
            category,
            description,
            quantity: 1,
            totalProductPrice: price,
          });
          toastMessage = `✅ ${name} added to the cart!`;
          toastClass = "text-bg-success";
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        const toastEl = document.getElementById("cartToast");
        toastEl.className = `toast align-items-center border-0 ${toastClass}`;
        document.getElementById("cartToastBody").textContent = toastMessage;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        updateCartCount();
      });

    // Append to container
    container.appendChild(productClone);
  });

  if (containerId === "productList") {
    return;
  }

  // Add a small delay to ensure DOM elements are properly attached
  setTimeout(() => {
    $(`#${containerId}`).owlCarousel({
      loop: true,
      margin: 30,
      nav: false,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        576: { items: 2 },
        768: { items: 3 },
        1200: { items: 4 },
      },
      onInitialized: function() {
        // Re-attach event listeners to cloned elements
        attachProductEventListeners(containerId);
      },
      onTranslated: function() {
        // Re-attach event listeners after carousel translation
        attachProductEventListeners(containerId);
      }
    });
  }, 100);
}

// Function to attach event listeners to carousel cloned elements
function attachProductEventListeners(containerId) {
  const container = document.getElementById(containerId);
  
  // Use event delegation for better performance and to handle cloned elements
  container.addEventListener('click', function(e) {
    e.stopPropagation();
    
    const productCard = e.target.closest('.item');
    if (!productCard) return;
    
    const productId = productCard.id.replace('product', '');
    if (!productId) return;
    
    // Handle view product icon clicks
    if (e.target.closest('#viewProduct')) {
      e.preventDefault();
      window.location.href = `product-details.html?id=${productId}`;
      return;
    }
    
    // Handle product image clicks
    if (e.target.closest('#product-img')) {
      e.preventDefault();
      window.location.href = `product-details.html?id=${productId}`;
      return;
    }
    
    // Handle wishlist clicks
    if (e.target.closest('#addWishList')) {
      e.preventDefault();
      handleWishlistClick(productId);
      return;
    }
    
    // Handle add to cart clicks
    if (e.target.closest('#addToCartBtn')) {
      e.preventDefault();
      handleAddToCartClick(productId);
      return;
    }
  });
}

// Helper function for wishlist functionality
function handleWishlistClick(productId) {
  // Find the product data
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const existingWishedPro = wishlist.findIndex(wishItem => wishItem.id == productId);
  
  let toastMessage = "";
  let toastClass = "";
  
  if (existingWishedPro > -1) {
    toastMessage = `🔄 ${product.name} is already in wish list`;
    toastClass = "text-bg-info";
  } else {
    toastMessage = `✅ ${product.name} added to the wishlist!`;
    toastClass = "text-bg-success";
    wishlist.push({
      id: product.id,
      image: product.image,
      name: product.name,
      stock: product.stock,
      price: product.price,
      category: product.category,
      description: product.description,
      quantity: 1,
    });
  }
  
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  
  const toastEl = document.getElementById("wishToast");
  toastEl.className = `toast align-items-center border-0 ${toastClass}`;
  document.getElementById("wishToastBody").textContent = toastMessage;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// Helper function for add to cart functionality
function handleAddToCartClick(productId) {
  // Find the product data
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let toastMessage = "";
  let toastClass = "";
  
  const existingId = cart.findIndex((item) => item.id == productId);
  if (existingId > -1) {
    toastMessage = `🔄 ${product.name} is already in cart`;
    toastClass = "text-bg-info";
  } else {
    cart.push({
      id: product.id,
      image: product.image,
      name: product.name,
      stock: product.stock,
      price: product.price,
      category: product.category,
      description: product.description,
      quantity: 1,
      totalProductPrice: product.price,
    });
    toastMessage = `✅ ${product.name} added to the cart!`;
    toastClass = "text-bg-success";
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  const toastEl = document.getElementById("cartToast");
  toastEl.className = `toast align-items-center border-0 ${toastClass}`;
  document.getElementById("cartToastBody").textContent = toastMessage;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  updateCartCount();
}
