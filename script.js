let input = document.getElementById("input-box");
let loading = document.getElementById("loading");
let container = document.querySelector(".main-container");
function debounc(delay) {
  let timer;
  return function (callback) {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
  };
}

let debouncing = debounc(300);

async function fetchRecipe(query) {
  if (!query) {
    container.innerHTML = "";
    return;
  }
  try {
    loading.style.display = "block";
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    let data = await res.json();
    if (!data.meals) {
      container.innerHTML = "<p style=color:#fff>No results found</p>";
      searchresult.innerHTML = "";
      return;
    }
    renderRecipe(data.meals);
  } catch (err) {
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}

function renderRecipe(recipes) {
  container.innerHTML = "";

  recipes.slice(0, 12).forEach((recipe) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<img loading="lazy"  src = ${recipe.strMealThumb} alt= "no image" class=img-thumb >
   <div class=content>
   <h2>${recipe.strMeal}</h2>
   <p><b>Category : </b>${recipe.strCategory}</p>
   <p><b>Area: </b>${recipe.strArea}</p></div>`;
    container.appendChild(card);
  });
}

input.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  debouncing(() => fetchRecipe(value));
});
