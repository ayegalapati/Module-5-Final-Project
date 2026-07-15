function openMenu() {
  document.body.classList += " menu--open"
}

function closeMenu() {
  document.body.classList.remove('menu--open')
}

const movieListEl = document.querySelector(".movie-list");
const id = localStorage.getItem("id");

async function onSearchChange(event) {
    const id = event.target.value;
    renderPosts(id);
}

async function renderPosts(id) {
    const posts = await fetch(`https://www.omdbapi.com/?apikey=54df8731&s=${id}`);
    const postsData = await posts.json();
    movieListEl.innerHTML = postsData.map(post => postHTML(post)).join('');
}

function postHTML(post) {
  return
  `<div class="movie">
      <div class="movie-poster">
        ${post[0].Poster}
      </div>
      <div class="movie-title">
        ${post[0].Title}
      </div>
      <div class="movie-year">
        ${post[0].Year}
      </div>
    </div>`;
}

renderPosts(id);