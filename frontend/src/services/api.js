import axios from "axios"

/*
 * Central place for all API calls.
 * The backend already exists. We only talk to it here.
 *
 * Change VITE_API_URL in a .env file if your backend runs somewhere else.
 * Example .env line:  VITE_API_URL=http://localhost:5000
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Create one axios instance we reuse everywhere.
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
})

/*
 * Request interceptor:
 * Before every request, grab the JWT from localStorage (if the user is
 * logged in) and attach it as an Authorization header.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* ----------------------------- Auth helpers ----------------------------- */

// Save the token + user after logging in / registering
export function saveAuth(token, user) {
  localStorage.setItem("token", token)
  if (user) {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

// Remove everything on logout
export function clearAuth() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Quick check used by the Navbar and protected pages
export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"))
}

// Read the cached user object (or null)
export function getStoredUser() {
  const raw = localStorage.getItem("user")
  return raw ? JSON.parse(raw) : null
}

/* --------------------------------- Auth --------------------------------- */

export function registerUser(data) {
  // data = { username, email, password }
  return api.post("/auth/register", data)
}

export function loginUser(data) {
  // data = { email, password }
  return api.post("/auth/login", data)
}

export function getProfile() {
  return api.get("/users/profile")
}

/* -------------------------------- Movies -------------------------------- */

export function getPopularMovies() {
  return api.get("/movies/popular")
}

export function searchMovies(query) {
  return api.get("/movies/search", { params: { query } })
}

export function getMovieById(id) {
  return api.get(`/movies/${id}`)
}

/* ------------------------------- Reviews -------------------------------- */

export function createReview(data) {
  // data = { movieId, rating, comment }
  return api.post("/reviews", data)
}

export function getReviews(movieId) {
  return api.get(`/reviews/${movieId}`)
}

export function updateReview(id, data) {
  return api.put(`/reviews/${id}`, data)
}

export function deleteReview(id) {
  return api.delete(`/reviews/${id}`)
}

/* ------------------------------ Watchlist ------------------------------- */

export function addToWatchlist(data) {
  // data = { movieId } (plus anything else your backend wants)
  return api.post("/watchlist", data)
}

export function getWatchlist() {
  return api.get("/watchlist")
}

export function removeFromWatchlist(movieId) {
  return api.delete(`/watchlist/${movieId}`)
}

export default api
