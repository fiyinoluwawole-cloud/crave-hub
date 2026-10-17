const successTotal = document.getElementById("successTotal");
const customerName = document.getElementById("customerName");

const successName = document.getElementById("successName");
const successPhone = document.getElementById("successPhone");
const successAddress = document.getElementById("successAddress");

const successItems = document.getElementById("successItems");
const successSubtotal = document.getElementById("successSubtotal");

const orderTotal = localStorage.getItem("orderTotal");
const name = localStorage.getItem("customerName");
const phone = localStorage.getItem("customerPhone");
const address = localStorage.getItem("customerAddress");

const orderItems =
    JSON.parse(localStorage.getItem("orderItems")) || [];

const orderSubtotal =
    localStorage.getItem("orderSubtotal");

const deliveryFee =
    localStorage.getItem("deliveryFee");

customerName.textContent = name;

successName.textContent = name;
successPhone.textContent = phone;
successAddress.textContent = address;

orderItems.forEach((item) => {

    successItems.innerHTML += `
        <div class="success-item">

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div>
                <h3>${item.name}</h3>
                <p>
                    ₦${item.price.toLocaleString()}
                    × ${item.quantity}
                </p>
            </div>

        </div>
    `;
});


successSubtotal.textContent =
    `₦${Number(orderSubtotal).toLocaleString()}`;

successTotal.textContent =
    `₦${Number(orderTotal).toLocaleString()}`;
