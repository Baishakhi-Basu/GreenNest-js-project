import products from "../api/available-products.json";
import { updateCartCount } from "../common";

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart"));

  const showCartProducts = document.getElementById("showCartProducts");

  if (cart.length === 0) {
    showCartProducts.innerHTML = `<div class="empty-cart"><span><i class="bi bi-cart-x"></i></span><h2>Your Cart is Empty. Start Shopping to Fill Your Cart!</h2><a href="products.html" class="btn-theme">Shop More</a></div>`;
    return;
  }

  const cartTableBody = document.getElementById("cartTableBody");
  const cartRowTemplate = document.getElementById("cartRowTemplate");

  cartTableBody.innerHTML = "";
  const cartSubtotal = document.getElementById("cartSubTotal");
  const cartShipping = document.getElementById("cartShipping");
  const cartTotalPrice = document.getElementById("cartTotalPrice");

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.totalProductPrice;
  }, 0);

  if (totalPrice >= 100) {
    cartShipping.textContent = "Free Shipping";
    cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
  } else {
    cartShipping.textContent = `$${(totalPrice * 0.1).toFixed(2)}`;
    const total = totalPrice + totalPrice * 0.1;
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  }

  if (cartTotalPrice) cartSubtotal.textContent = `$${totalPrice.toFixed(2)}`;

  cart.forEach((cartItem) => {
    const clone = cartRowTemplate.content.cloneNode(true);

    clone.getElementById("cartProImage").src = cartItem.image;
    clone.getElementById("cartProImage").alt = cartItem.name;
    clone.getElementById("cartProName").textContent = cartItem.name;
    clone.getElementById("cartPrice").textContent = `$${cartItem.price}`;
    clone.getElementById("cartQty").textContent = cartItem.quantity;
    clone.getElementById("cartSubtotal").textContent = `$${(
      cartItem.price * cartItem.quantity
    ).toFixed(2)}`;

    const btnIncrease = clone.querySelector("#btn-increase");
    const btnDecrease = clone.querySelector("#btn-decrease");
    const btnRemove = clone.querySelector("#btn-remove");

    btnIncrease.addEventListener("click", () => {
      updateQuantity(cartItem.id, "addition");
    });

    btnDecrease.addEventListener("click", () =>
      updateQuantity(cartItem.id, "substraction")
    );

    btnRemove.addEventListener("click", () => {
      removeCartItem(cartItem.id);
    });
    // clone
    //   .querySelector("#btn-remove")
    //   .addEventListener("click", () => removeCartItem(cartItem.id));

    cartTableBody.appendChild(clone);
  });
}

function updateQuantity(id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.map((cartItem) => {
    // if (cartItem.id === id) {
    //   return {
    //     ...cartItem,
    //     quantity:
    //       cartItem.quantity >= cartItem.stock
    //         ? cartItem.stock
    //         : cartItem.quantity + change,
    //     totalProductPrice: cartItem.price * cartItem.quantity,
    //   };
    // }
    if (cartItem.id === id) {
      if (change === "addition") {
        cartItem.quantity++;
        cartItem.quantity > cartItem.stock &&
          (cartItem.quantity = cartItem.stock);
        cartItem.totalProductPrice = cartItem.quantity * cartItem.price;
      } else if (change === "substraction" && cartItem.quantity > 1) {
        cartItem.quantity--;
        cartItem.totalProductPrice = cartItem.quantity * cartItem.price;
      }
    }
    return cartItem;
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  //window.dispatchEvent(new Event("cartUpdated"));
  renderCart();
}

export function removeCartItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((cartItem) => {
    return cartItem.id !== id;
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  //window.dispatchEvent(new Event("cartUpdated"));
  renderCart();
}

renderCart();
