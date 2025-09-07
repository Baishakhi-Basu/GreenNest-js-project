const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const state = document.getElementById("state");

usStates.forEach((stateElement) => {
  const option = document.createElement("option");
  option.value = stateElement;
  option.textContent = stateElement;
  state.appendChild(option);
});

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;
    let firstInvalidField = null;

    document
      .querySelectorAll(".error")
      .forEach((errElement) => (errElement.textContent = ""));

    function setError(id, message) {
      document.getElementById(id + "Error").textContent = message;
      if (!firstInvalidField) {
        firstInvalidField = document.getElementById(id);
      }
      valid = false;
    }

    if (document.getElementById("firstName").value.trim() === "") {
      setError("firstName", "Name is missing!");
    }

    const email = document.getElementById("email").value.trim();
    const emailRegex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailRegex.test(email)) setError("email", "Email is invalid!");

    const phone = document.getElementById("phone").value.trim();
    const phoneReg = /^[0-9]{10}$/;
    if (!phoneReg.test(phone)) setError("phone", "Phone number is invalid!");

    if (document.getElementById("address").value.trim() === "") {
      setError("address", "Address is invalid!");
    }

    if (document.getElementById("state").value.trim() === "") {
      setError("state", "State is invalid");
    }

    if (document.getElementById("city").value.trim() === "") {
      setError("city", "City is invalid!");
    }

    const zip = document.getElementById("zip").value.trim();
    const zipzreg = /^[0-9]{5}$/;
    if (!zipzreg.test(zip)) {
      setError("zip", "Zip code is invalid");
    }

    if (document.getElementById("cardType").value.trim() === "") {
      setError("cardType", "Please select a card type.");
    }

    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardNumberReg = /^[0-9]{16}$/;
    if (!cardNumberReg.test(cardNumber)) {
      setError("cardNumber", "Card number is invalid!");
    }

    const expiryMonth = document.getElementById("expiryMonth").value.trim();
    if (!/^(0[1-9]|1[0-2])$/.test(expiryMonth))
      setError("expiryMonth", "Enter a valid month (01-12).");

    const expiryYear = document.getElementById("expiryYear").value.trim();
    const currentYear = new Date().getFullYear();
    if (!/^[0-9]{4}$/.test(expiryYear) || parseInt(expiryYear) < currentYear)
      setError("expiryYear", "Enter a valid expiry year.");

    const cvv = document.getElementById("cvv").value.trim();
    if (!/^[0-9]{3}$/.test(cvv)) setError("cvv", "Enter a valid 3-digit CVV.");

    if (!document.getElementById("terms").checked) {
      document.getElementById("termsError").textContent =
        "You must agree before submitting.";
      firstInvalidField = firstInvalidField || document.getElementById("terms");
      valid = false;
    }

    if (!valid && firstInvalidField) {
      firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidField.focus();
    }
    if (valid) {
      alert("Form Submitted Successfully!");
      this.reset();
      window.location.href = "thankyou.html";
    }
  });

// Populate cart details

const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemTable = document.getElementById("cartItemTable");

const totalPrice = cart.reduce((acc, cartEl) => {
  return acc + cartEl.totalProductPrice;
}, 0);

cart.forEach((cartItem) => {
  const cartRow = document.createElement("tr");
  cartRow.innerHTML = `<td>${cartItem.name} X ${cartItem.quantity} </td>
  <td>$${cartItem.price * cartItem.quantity}
  `;
  cartItemTable.appendChild(cartRow);
});

const shippingPrice = document.getElementById("shipping-price");

if (totalPrice > 100) {
  shippingPrice.textContent = "Free Shipping";
} else {
  shippingPrice.textContent = `$${(totalPrice * 0.1).toFixed(2)}`;
}

document.getElementById("total-price").textContent = `$${totalPrice.toFixed(
  2
)}`;

// const cartItems = [
//   { name: "Bamboo Sofa", price: 99, quantity: 1 },
//   { name: "Eco-Friendly Table", price: 79, quantity: 1 },
// ];

// const cartNameQty = document.getElementById("cart-name-qty");
// const cartPrice = document.getElementById("cart-price");

// cartItems.forEach((item) => {
//   const itemRow = document.createElement("tr");
//   itemRow.innerHTML = `
//     <td>${item.name} X ${item.quantity}</td>
//     <td>$${item.price}</td>
//   `;
//   cartNameQty.appendChild(itemRow);
// });
