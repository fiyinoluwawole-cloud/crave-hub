const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const foodContainer = document.getElementById("foodContainer");
const categoryButtons = document.querySelectorAll(".category");
const viewAllBtn = document.getElementById("viewAllBtn");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

let showAll = false;
let currentCategory = "all";
let currentSearch = "";
let allFoods = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// FOOD PRICES

const foodPrices = {
  "Chicken Handi": 6500,
  "Chicken Curry": 5500,
  "Beef Wellington": 9000,
  "Beef and Mustard Pie": 7000,
  "Spaghetti Bolognese": 5000,
  "Fish Pie": 6000,
  "Chocolate Gateau": 3500,
  Cheesecake: 4000,
};

function getPrice(food) {
  return foodPrices[food.strMeal] || 5000;
}

// DISPLAY FOODS

function displayFoods(foods) {
  foodContainer.innerHTML = "";

  if (!foods) {
    foodContainer.innerHTML = `
            <div class="no-food">
                <h3>No meals found</h3>
                <p>Try searching for something else.</p>
            </div>
        `;

    viewAllBtn.style.display = "none";

    return;
  }

  allFoods = foods;

  let foodsToShow = showAll ? foods : foods.slice(0, 6);

  foodsToShow.forEach((food) => {
    foodContainer.innerHTML += `

            <div class="food-card">

                <div class="food-image">
                    <img
                        src="${food.strMealThumb}"
                        alt="${food.strMeal}"
                    >
                </div>

                <div class="food-info">

                    <p class="food-category">
                        ${food.strCategory || "Meal"}
                    </p>

                    <h3>${food.strMeal}</h3>

                    <div class="food-bottom">

                        <strong>
                            ₦${getPrice(food).toLocaleString()}
                        </strong>

                        <button
                            class="add-btn"
                            data-id="${food.idMeal}"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>

                </div>

            </div>

        `;
  });

  viewAllBtn.style.display = foods.length > 6 ? "block" : "none";
}

// GET FOODS

function getFoods(category) {
  let url;

  if (category === "all") {
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  } else {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  }

  foodContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading delicious meals...</p>
        </div>
    `;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayFoods(data.meals);
    });
}

// CATEGORY BUTTONS

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentCategory = button.dataset.category;

    currentSearch = "";
    searchInput.value = "";

    showAll = false;

    viewAllBtn.innerHTML = `
            View All
            <i class="fa-solid fa-arrow-right"></i>
        `;

    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    getFoods(currentCategory);
  });
});

// VIEW ALL / SHOW LESS

viewAllBtn.addEventListener("click", () => {
  showAll = !showAll;

  viewAllBtn.innerHTML = showAll
    ? `Show Less <i class="fa-solid fa-arrow-up"></i>`
    : `View All <i class="fa-solid fa-arrow-right"></i>`;

  if (currentSearch) {
    searchFoods(currentSearch);
  } else {
    getFoods(currentCategory);
  }
});

// SEARCH

function searchFoods(value) {
  foodContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Searching for delicious meals...</p>
        </div>
    `;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
    .then((response) => response.json())
    .then((data) => {
      displayFoods(data.meals);
    });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();

  currentSearch = value;

  showAll = false;

  if (value === "") {
    currentSearch = "";
    currentCategory = "all";

    categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    categoryButtons[0].classList.add("active");

    getFoods("all");

    return;
  }

  viewAllBtn.innerHTML = `
        View All
        <i class="fa-solid fa-arrow-right"></i>
    `;

  searchFoods(value);
});

// ADD TO CART

foodContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".add-btn");

  if (!button) {
    return;
  }

  const foodId = button.dataset.id;

  const food = allFoods.find((item) => {
    return item.idMeal === foodId;
  });

  if (!food) {
    console.log("Food not found");
    return;
  }

  const existingFood = cart.find((item) => {
    return item.idMeal === foodId;
  });

  if (existingFood) {
    existingFood.quantity++;
  } else {
    cart.push({
      idMeal: food.idMeal,
      name: food.strMeal,
      image: food.strMealThumb,
      price: getPrice(food),
      quantity: 1,
    });
  }

  updateCart();

  alert("Food has been added to cart!");
});

// UPDATE CART COUNT

function updateCart() {
  let totalItems = 0;

  let totalPrice = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;
  }

  cart.forEach((item) => {
    totalItems += item.quantity;

    totalPrice += item.price * item.quantity;
    cartItems.innerHTML += `
    <div class="cart-item">

    <img
        src="${item.image}"
        alt="${item.name}"
    >
    <div class="cart-item-info">

        <h4>
            ${item.name}
        </h4>

        <p>
            ₦${item.price.toLocaleString()}
        </p>
    <div class="quantity">

    <button
        class="decrease"
        data-id="${item.idMeal}"
    >
        −
    </button>

    <span>
        ${item.quantity}
    </span>

    <button
        class="increase"
        data-id="${item.idMeal}"
    >
        +
    </button>

</div>

<button
    class="remove-item"
    data-id="${item.idMeal}"
>
    Remove
</button>

                </div>

            </div>

        `;
  });

  cartCount.textContent = totalItems;


  cartTotal.textContent = `₦${totalPrice.toLocaleString()}`;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// START

getFoods("all");

const cartIcon = document.getElementById("cartIcon");

cartIcon.addEventListener("click", () => {
  cartPanel.classList.add("active");

  cartOverlay.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("active");

  cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", () => {
  cartPanel.classList.remove("active");

  cartOverlay.classList.remove("active");
});

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

cartItems.addEventListener("click", (event) => {
  const id = event.target.dataset.id;

  if (event.target.classList.contains("increase")) {
    const item = cart.find((item) => item.idMeal === id);

    item.quantity++;

    updateCart();
  }

  if (event.target.classList.contains("decrease")) {
    const item = cart.find((item) => item.idMeal === id);

    item.quantity--;

    if (item.quantity === 0) {
      cart = cart.filter((item) => item.idMeal !== id);
    }
    updateCart();
  }

  if (event.target.classList.contains("remove-item")) {
    cart = cart.filter((item) => item.idMeal !== id);

    updateCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");

    return;
  }

  window.location.href = "checkout.html";
});
getFoods("all");

updateCart();
