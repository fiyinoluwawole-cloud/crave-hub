const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const addressError = document.getElementById("addressError");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const deliveryFee = document.getElementById("deliveryFee");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  alert("Your cart is empty!");
  window.location.href = "home.html";
}

let total = 0;

const delivery = 1000;

cart.forEach((item) => {
  total += item.price * item.quantity;

  checkoutItems.innerHTML += `

        <div class="checkout-item">

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₦${item.price.toLocaleString()}
                    × ${item.quantity}
                </p>

            </div>

        </div>

    `;
});

const finalTotal = total + delivery;

checkoutSubtotal.textContent = `₦${total.toLocaleString()}`;

deliveryFee.textContent = `₦${delivery.toLocaleString()}`;

checkoutTotal.textContent = `₦${finalTotal.toLocaleString()}`;


const placeOrderBtn = document.getElementById("placeOrderBtn");

const customerName = document.getElementById("customerName");

const customerPhone = document.getElementById("customerPhone");

const customerAddress = document.getElementById("customerAddress");

placeOrderBtn.addEventListener("click", () => {
  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();
  const address = customerAddress.value.trim();

  // CLEAR OLD ERRORS

  nameError.textContent = "";
  phoneError.textContent = "";
  addressError.textContent = "";

  customerName.classList.remove("input-error");
  customerPhone.classList.remove("input-error");
  customerAddress.classList.remove("input-error");

  let valid = true;

  // NAME

  if (name === "") {
    nameError.textContent = "Please enter your full name.";

    customerName.classList.add("input-error");

    valid = false;
  }

  // PHONE

  if (phone === "") {
    phoneError.textContent = "Please enter your phone number.";

    customerPhone.classList.add("input-error");

    valid = false;
  } else if (!/^[0-9]{11}$/.test(phone)) {
    phoneError.textContent = "Enter a valid 11-digit Nigerian phone number.";

    customerPhone.classList.add("input-error");

    valid = false;
  }

  // ADDRESS

  if (address === "") {
    addressError.textContent = "Please enter your delivery address.";

    customerAddress.classList.add("input-error");

    valid = false;
  } else if (address.length < 10) {
    addressError.textContent = "Please enter a valid delivery address.";

    customerAddress.classList.add("input-error");

    valid = false;
  }

  // STOP IF INVALID

  if (!valid) {
    return;
  }

localStorage.setItem("orderTotal", finalTotal);
localStorage.setItem("customerName", name);
localStorage.setItem("customerPhone", phone);
localStorage.setItem("customerAddress", address);
localStorage.setItem("orderItems", JSON.stringify(cart));
localStorage.setItem("orderSubtotal", total);
localStorage.setItem("deliveryFee", delivery);

localStorage.removeItem("cart");

window.location.href = "success.html";


});
