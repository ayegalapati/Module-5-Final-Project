const movieListEl = document.querySelector('.movie-list');
const id = localStorage.getItem("id");

async function renderPosts(id) {
    const posts = await fetch('https://www.omdbapi.com/?i=tt3896198&apikey=54df8731');
    console.log(posts.json());
}

renderPosts(id);