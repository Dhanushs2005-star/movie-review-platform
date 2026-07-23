import { useEffect, useState } from "react"
import { getPopularMovies, searchMovies } from "../services/api"
import MovieCard from "../components/MovieCard"
import SearchBar from "../components/SearchBar"
import Loader from "../components/Loader"

// Home page: hero banner, search bar, and a grid of movies.
function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Track whether we are showing popular movies or search results.
  const [searchTerm, setSearchTerm] = useState("")

  // Load popular movies when the page first opens.
  useEffect(() => {
    loadPopular()
  }, [])

  async function loadPopular() {
    try {
      setLoading(true)
      setError("")
      const res = await getPopularMovies()
      // The list might be res.data or res.data.results depending on backend.
      setMovies(res.data.results || res.data)
    } catch (err) {
      console.log("[v0] Failed to load popular movies:", err.message)
      setError("Could not load movies. Please make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(query) {
    // Empty search resets back to popular movies.
    if (!query) {
      setSearchTerm("")
      loadPopular()
      return
    }

    try {
      setLoading(true)
      setError("")
      setSearchTerm(query)
      const res = await searchMovies(query)
      setMovies(res.data.results || res.data)
    } catch (err) {
      console.log("[v0] Search failed:", err.message)
      setError("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container page">
      {/* Hero banner */}
      <section className="hero">
        <img src="/hero.png" alt="" className="hero-bg" />
        <div className="hero-content">
          <h1 className="hero-title">
            Find your next <span className="accent">favorite movie</span>
          </h1>
          <p className="hero-subtitle">
            Browse popular movies, read and write reviews, and build your own
            watchlist.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Movie grid */}
      <section>
        <h2 className="section-title">
          {searchTerm ? `Results for "${searchTerm}"` : "Popular Movies"}
        </h2>

        {loading ? (
          <Loader text="Loading movies..." />
        ) : error ? (
          <div className="empty-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <h2>No movies found</h2>
            <p>Try searching for a different title.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id || movie._id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
