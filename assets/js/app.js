const recipesGrid = document.getElementById("recipesGrid");
const recipesStatus = document.getElementById("recipesStatus");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const recipeModal = document.getElementById("recipeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalInstructions = document.getElementById("modalInstructions");
const modalClose = document.querySelector(".modal-close");

function showLoading() {
  recipesStatus.style.display = "flex";
  recipesStatus.querySelector(".loader").style.display = "block";
  recipesStatus.querySelector(".status-text").textContent =
    "Loading recipes...";
  recipesGrid.innerHTML = "";
}

function showNoData() {
  recipesStatus.style.display = "flex";
  recipesStatus.querySelector(".loader").style.display = "none";
  recipesStatus.querySelector(".status-text").textContent = "No recipes found";
  recipesGrid.innerHTML = "";
  searchBtn.disabled = false;
}

function hideStatus() {
  recipesStatus.style.display = "none";
  searchBtn.disabled = false;
}

async function fetchRecipes(query = "") {
  showLoading();
  searchBtn.disabled = true;

  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.meals) {
      showNoData();
      return;
    }

    hideStatus();
    displayRecipes(data.meals);
  } catch (error) {
    showNoData();
  }
}
async function openRecipeModal(id) {
  recipeModal.style.display = "flex";

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    const meal = data.meals[0];

    modalImage.src = meal.strMealThumb;
    modalImage.alt = meal.strMeal;
    modalTitle.textContent = meal.strMeal;
    modalInstructions.textContent = meal.strInstructions;
  } catch (error) {
    modalTitle.textContent = "Failed to load recipe";
    modalInstructions.textContent = "";
  }
}

function displayRecipes(meals) {
  recipesGrid.innerHTML = "";

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    const content = document.createElement("div");
    content.className = "recipe-content";

    const title = document.createElement("h4");
    title.textContent = meal.strMeal;

    const desc = document.createElement("p");
    desc.textContent = meal.strInstructions.slice(0, 100) + "...";

    const action = document.createElement("div");
    action.className = "recipe-action";

    const btn = document.createElement("button");
    btn.textContent = "VIEW DETAILS";
    btn.addEventListener("click", () => {
      openRecipeModal(meal.idMeal);
    });

    action.appendChild(btn);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(action);

    card.appendChild(img);
    card.appendChild(content);

    recipesGrid.appendChild(card);
  });
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  fetchRecipes(query);
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
modalClose.addEventListener("click", () => {
  recipeModal.style.display = "none";
});

recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) {
    recipeModal.style.display = "none";
  }
});

fetchRecipes();
