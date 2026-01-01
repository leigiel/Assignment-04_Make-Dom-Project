const recipesGrid = document.getElementById("recipesGrid");
const recipesStatus = document.getElementById("recipesStatus");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const recipeModal = document.getElementById("recipeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalInstructions = document.getElementById("modalInstructions");
const modalLoader = document.getElementById("modalLoader");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalBody = document.querySelector(".modal-body");
const scrollTopBtn = document.getElementById("scrollTopBtn");

function resetModal() {
  modalImage.src = "";
  modalTitle.textContent = "";
  modalInstructions.textContent = "";
}

window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? "flex" : "none";
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

modalCloseBtn.addEventListener("click", () => {
  recipeModal.style.display = "none";
  resetModal();
});

recipeModal.addEventListener("click", (e) => {
  if (e.target === recipeModal) {
    recipeModal.style.display = "none";
    resetModal();
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

searchBtn.addEventListener("click", () => {
  fetchRecipes(searchInput.value.trim());
});

function showLoading() {
  recipesStatus.style.display = "flex";
  recipesGrid.innerHTML = "";
}

function hideStatus() {
  recipesStatus.style.display = "none";
}

async function fetchRecipes(query = "") {
  showLoading();
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();
    if (!data.meals) {
      recipesStatus.querySelector(".status-text").textContent =
        "No recipes found";
      return;
    }
    hideStatus();
    displayRecipes(data.meals);
  } catch {
    recipesStatus.querySelector(".status-text").textContent =
      "Failed to load recipes";
  }
}

async function openRecipeModal(id) {
  recipeModal.style.display = "flex";
  resetModal();
  modalLoader.style.display = "block";
  modalBody.style.opacity = "0.5";

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    const meal = data.meals[0];

    modalImage.src = meal.strMealThumb;
    modalTitle.textContent = meal.strMeal;
    modalInstructions.textContent = meal.strInstructions;
  } catch {
    modalTitle.textContent = "Failed to load recipe";
    modalInstructions.textContent = "";
  } finally {
    modalLoader.style.display = "none";
    modalBody.style.opacity = "1";
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
    btn.addEventListener("click", () => openRecipeModal(meal.idMeal));

    action.appendChild(btn);
    content.append(title, desc, action);
    card.append(img, content);
    recipesGrid.appendChild(card);
  });
}

fetchRecipes();
