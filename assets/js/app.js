const recipesGrid = document.getElementById("recipesGrid");
const searchInput = document.getElementById("searchInput");

async function fetchRecipes(query = "") {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  displayRecipes(data.meals);
}

function displayRecipes(meals) {
  recipesGrid.innerHTML = "";
  if (!meals) return;

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.src = meal.strMealThumb;

    const content = document.createElement("div");
    content.className = "recipe-content";

    const title = document.createElement("h4");
    title.textContent = meal.strMeal;
    const details = document.createElement("p");

    const text =
      meal.strInstructions.length > 90
        ? meal.strInstructions.slice(0, 90) + "..."
        : meal.strInstructions;

    details.textContent = text;

    const action = document.createElement("div");
    action.className = "recipe-action";

    const btn = document.createElement("button");
    btn.textContent = "VIEW DETAILS";

    action.appendChild(btn);
    content.appendChild(title);
    content.appendChild(details);
    content.appendChild(action);

    card.appendChild(img);
    card.appendChild(content);

    recipesGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  fetchRecipes(e.target.value);
});

fetchRecipes();
