let input = document.getElementById("input-box");
let loading = document.getElementById("loading");
let container = document.querySelector(".main-container");
let searchResult = document.querySelector(".search-result");

let currentIndex = -1;

/* ---------- DEBOUNCE ---------- */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ---------- FETCH API ---------- */
async function fetchRecipe(query) {
  if (!query) {
    container.innerHTML = "";
    searchResult.innerHTML = "";
    currentIndex = -1;
    return;
  }

  try {
    loading.style.display = "block";

    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();

    if (!data.meals) {
      container.innerHTML = "<p style='color:#fff'>No results found</p>";
      searchResult.innerHTML = "";
      currentIndex = -1;
      return;
    }

    renderRecipe(data.meals);
  } catch (error) {
    console.error(error);
  } finally {
    loading.style.display = "none";
  }
}

/* ---------- RENDER ---------- */
function renderRecipe(recipes) {
  container.innerHTML = "";
  searchResult.innerHTML = "";
  currentIndex = -1;

  recipes.slice(0, 12).forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${recipe.strMealThumb}" loading="lazy">
      <div class="content">
        <h2>${recipe.strMeal}</h2>
        <p><b>Category:</b> ${recipe.strCategory}</p>
        <p><b>Area:</b> ${recipe.strArea}</p>
      </div>
    `;
    container.appendChild(card);

    const li = document.createElement("li");
    li.textContent = recipe.strMeal;
    searchResult.appendChild(li);
  });
}

/* ---------- INPUT ---------- */
const debouncedSearch = debounce(fetchRecipe, 300);

input.addEventListener("input", (e) => {
  debouncedSearch(e.target.value.trim());
});

/* ---------- KEYBOARD NAV ---------- */
document.addEventListener("keydown", (e) => {
  const items = document.querySelectorAll(".search-result li");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    currentIndex = (currentIndex + 1) % items.length;
  }

  if (e.key === "ArrowUp") {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
  }

  if (e.key === "Enter" && currentIndex >= 0) {
    input.value = items[currentIndex].textContent;
    searchResult.innerHTML = "";
    currentIndex = -1;
    fetchRecipe(input.value);
    return;
  }

  items.forEach((item) => item.classList.remove("active"));
  if (currentIndex >= 0) items[currentIndex].classList.add("active");
});
