// ============================================================
// 1. MENU TOGGLE
// ============================================================
function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

// ============================================================
// 2. DOM REFS
// ============================================================
const movieListEl = document.querySelector(".movie-list");
const searchInput = document.querySelector(".searchBar--input");
const searchButton = document.querySelector(".searchBar button");
const loading = document.querySelector('.modal__overlay--loading');
const sortSelect = document.getElementById("sortSelect");
let currentMovies = [];

// ============================================================
// 3. SEARCH TRIGGERS (Button click, Enter key, onchange)
// ============================================================

// 3a. Button click
searchButton.addEventListener("click", function () {
  const term = searchInput.value.trim();
  if (term) renderPosts(term);
});

// 3b. Enter key inside input
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const term = this.value.trim();
    if (term) renderPosts(term);
  }
});

// 3c. onchange (fires when input loses focus)
async function onSearchChange(event) {
  const term = event.target.value.trim();
  if (term) await renderPosts(term);
}

// ============================================================
// 4. FETCH & RENDER
// ============================================================
async function renderPosts(searchTerm) {
  loading.classList += " modal__overlay--visible";
  try {
    // Show loading state
    movieListEl.innerHTML = `<div class="loading">Searching for "${searchTerm}"...</div>`;

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=54df8731&s=${encodeURIComponent(searchTerm)}`
    );
    const postsData = await response.json();

    // OMDb returns { Search: [...], totalResults: "...", Response: "True/False" }
    if (postsData.Response === "False") {
      loading.classList.remove("modal__overlay--visible");
      movieListEl.innerHTML = `<div class="no-results">❌ No movies found for "${searchTerm}"</div>`;
      return;
    }

    currentMovies = postsData.Search || [];
    if (currentMovies.length === 0) {
      loading.classList.remove("modal__overlay--visible");
      movieListEl.innerHTML = `<div class="no-results">No movies found for "${searchTerm}"</div>`;
      return;
    }

    // Build HTML for each movie and insert
    const sortedMovies = sortMovies(currentMovies);
    movieListEl.innerHTML = sortedMovies.map(movie => postHTML(movie)).join("");

    loading.classList.remove("modal__overlay--visible");
  } catch (error) {
    loading.classList.remove("modal__overlay--visible");
    console.error("Fetch error:", error);
    movieListEl.innerHTML = `<div class="error">⚠️ Failed to load movies. Please try again.</div>`;
  }
}

function sortMovies(currentMovies) {
    const sorted = [...currentMovies];

    switch (sortSelect.value) {

        case "newest":
            sorted.sort((a, b) => Number(b.Year) - Number(a.Year));
            break;

        case "oldest":
            sorted.sort((a, b) => Number(a.Year) - Number(b.Year));
            break;

        case "az":
            sorted.sort((a, b) => a.Title.localeCompare(b.Title));
            break;

        case "za":
            sorted.sort((a, b) => b.Title.localeCompare(a.Title));
            break;

        default:
            break;
    }

    return sorted;
}

sortSelect.addEventListener("change", () => {

    if (currentMovies.length === 0) return;

    const sortedMovies = sortMovies(currentMovies);

    movieListEl.innerHTML = sortedMovies
        .map(movie => postHTML(movie))
        .join("");
});

// ============================================================
// 5. MOVIE CARD HTML
// ============================================================
function postHTML(movie) {
  const posterUrl =
    movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

  // IMPORTANT: 'return' and template literal must be on the same line
  return `<div class="movie">
    <div class="movie-poster">
      <img src="${posterUrl}" alt="${movie.Title} poster" loading="lazy">
    </div>
    <div class="movie-title">${movie.Title}</div>
    <div class="movie-year">(${movie.Year})</div>
  </div>`;
}

// ============================================================
// 6. INITIAL LOAD
// ============================================================
const storedId = localStorage.getItem("id");

if (storedId) {
  renderPosts(storedId);
} else {
  // Default: show something on first visit
  renderPosts("movie");
}