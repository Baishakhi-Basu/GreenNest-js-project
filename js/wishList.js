import { updateWishlistCount, updateCartCount } from "../common.js";

function renderWish() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const wishlistTableBody = document.getElementById("wishlistTableBody");
  const wishlistTemplate = document.getElementById("wishlistRowTemplate");
  const showishlistProducts = document.getElementById("showishlistProducts");

  if (wishlist.length === 0) {
    showishlistProducts.innerHTML = `<div class="empty-wish"><span><i class="bi bi-heart"></i></span><h2>Your wishlist is empty. Add your favourite product here!</h2><a href="products.html" class="btn-theme">Shop More</a></div>`;
    return;
  }

  wishlistTableBody.innerHTML = "";

  wishlist.forEach((wishItem) => {
    const clone = wishlistTemplate.content.cloneNode(true);
    clone.querySelector("#wishlistProImage").src = wishItem.image;
    clone.querySelector("#wishlistProImage").alt = wishItem.name;
    clone.querySelector("#wishlistProName").textContent = wishItem.name;
    clone.querySelector("#wishlistPrice").textContent = wishItem.price;
    clone.querySelector(
      "#wishlistStock"
    ).textContent = `In stock (${wishItem.stock})`;

    // Check if item is already in cart and update UI accordingly
    const cartButton = clone.querySelector("#wishlistAddToCart");
    const isInCart = cart.some((cartItem) => cartItem.id === wishItem.id);

    if (isInCart) {
      cartButton.innerHTML = `<span><i class="bi bi-cart-fill"></i></span> Added in Cart`;
      cartButton.style.color = "#ffc107";
      cartButton.style.fontWeight = "600";
    } else {
      cartButton.innerHTML = `<span><i class="bi bi-cart3"></i></span> Add To Cart`;
      cartButton.style.color = "";
      cartButton.style.fontWeight = "";
    }

    cartButton.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      //   console.log("wishing...");
      const existingCartItem = cart.findIndex(
        (cartItem) => cartItem.id === wishItem.id
      );

      let toastMessage = "";
      let toastClass = "";

      if (existingCartItem > -1) {
        toastMessage = `🔄 ${wishItem.name} is already in the cart!`;
        toastClass = "text-bg-info";
      } else {
        cart.push({
          id: wishItem.id,
          image: wishItem.image,
          name: wishItem.name,
          stock: wishItem.stock,
          price: wishItem.price,
          category: wishItem.category,
          description: wishItem.description,
          quantity: 1,
          totalProductPrice: Math.round(wishItem.price * 100) / 100,
        });
        toastMessage = `✅ ${wishItem.name} added to the cart!`;
        toastClass = "text-bg-success";
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      // Update the button appearance after adding to cart
      if (existingCartItem === -1) {
        cartButton.innerHTML = `<span><i class="bi bi-cart-fill"></i></span> Added in Cart`;
        cartButton.style.color = "#ffc107";
        cartButton.style.fontWeight = "600";
      }

      const toastEl = document.getElementById("cartToast");
      toastEl.className = `toast align-items-center border-0 ${toastClass}`;
      document.getElementById("cartToastBody").textContent = toastMessage;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    });

    clone.querySelector("#btn-remove").addEventListener("click", () => {
      removeItem(wishItem.id);
      const toastEl2 = document.getElementById("wishToast");
      toastEl2.className = `toast align-items-center border-0 text-bg-secondary`;
      document.getElementById(
        "wishToastBody"
      ).textContent = `❌ ${wishItem.name} removed from the wishlist!`;
      const toast = new bootstrap.Toast(toastEl2);
      toast.show();
    });

    wishlistTableBody.appendChild(clone);
  });
}

function removeItem(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  wishlist = wishlist.filter((wishEl) => {
    // console.log("hi there...");
    return wishEl.id !== id;
  });
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  renderWish();
}

renderWish();
