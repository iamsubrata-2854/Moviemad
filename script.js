const API_KEY = "daf2cf2c";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

// --- NEW VARIABLES ADDED HERE ---
const watchBtn = document.getElementById("watchBtn");
const comingSoonModal = document.getElementById("comingSoonModal");
const closeComingSoon = document.getElementById("closeComingSoon");
const requestBtn = document.getElementById("requestBtn");

// --- NEW MANUAL LINK DATABASE ---
const movieLinks = {
  "tt1375666": "https://netflix.com",   // Inception
  "tt0111161": "https://primevideo.com" // Shawshank Redemption
};
// Curated list of popular movie IMDb IDs — add/change as you like
const popularMovies = [
  "tt1375666", // Inception
  "tt0111161", // The Shawshank Redemption
  "tt0468569", // The Dark Knight
  "tt0137523", // Fight Club
  "tt0109830", // Forrest Gump
  "tt0110912", // Pulp Fiction
  "tt0816692", // Interstellar
  "tt6751668"  // Parasite
];
// --- EVENT LISTENERS ---
searchBtn.addEventListener("click", searchMovies);
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
// New listener to close the coming soon modal
closeComingSoon.addEventListener("click", () => comingSoonModal.classList.add("hidden"));

// --- FUNCTIONS ---
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return;

  results.innerHTML = "Loading...";
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
  const data = await res.json();

  results.innerHTML = "";
  if (data.Response === "False") {
    results.innerHTML = "No movies found.";
    return;
  }

  data.Search.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/160x230?text=No+Image'}">
      <p>${movie.Title} (${movie.Year})</p>
    `;
    card.addEventListener("click", () => showDetails(movie.imdbID));
    results.appendChild(card);
  });
}
async function loadPopularMovies() {
  results.innerHTML = "Loading popular movies...";
  results.innerHTML = "";

  for (const id of popularMovies) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    const movie = await res.json();
    if (movie.Response === "False") continue;

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/160x230?text=No+Image'}">
      <p>${movie.Title} (${movie.Year})</p>
    `;
    card.addEventListener("click", () => showDetails(movie.imdbID));
    results.appendChild(card);
  }
}
// --- UPDATED SHOWDETAILS FUNCTION ---
async function showDetails(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
  const movie = await res.json();

  modalBody.innerHTML = `
    <img src="${movie.Poster !== "N/A" ? movie.Poster : ''}">
    <h2>${movie.Title} (${movie.Year})</h2>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
    <p>${movie.Plot}</p>
  `;
  modal.classList.remove("hidden");

  // New click logic for the watch button inside the modal
  watchBtn.onclick = () => {
    const link = movieLinks[movie.imdbID];
    if (link) {
      window.open(link, "_blank");
    } else {
      const formBase = "https://docs.google.com/forms/d/e/1FAIpQLSd_g1K7M_BTf_zoQVcNAdihALtz0RZ5NQkg8gdf8-uZY0Bkbg/viewform";
      const prefill = `?usp=pp_url&entry.123456=${encodeURIComponent(movie.Title)}&entry.789012=${encodeURIComponent(movie.Year)}`;
      requestBtn.href = formBase + prefill;
      requestBtn.target = "_blank";
      comingSoonModal.classList.remove("hidden");
    }
  };
}
// Load popular movies when the page first opens
loadPopularMovies();
