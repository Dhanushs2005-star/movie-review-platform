import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getWatchlist, removeFromWatchlist, isLoggedIn,getMovieById } from "../services/api"
import Loader from "../components/Loader"

// Build a poster URL that works for a few common backend shapes.
function getPosterUrl(movie) {
  const path = movie.poster_path || movie.poster || movie.posterUrl
  if (!path) return "https://placehold.co/300x450/1e1e1e/f5c518?text=No+Image"
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w342${path}`
}

// The user's saved movies. Each has a Remove button.
function Watchlist() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Guard: only logged in users can see this page.
    if (!isLoggedIn()) {
      navigate("/login")
      return
    }
    loadWatchlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

 async function loadWatchlist() {
  try {
    setLoading(true)

    const res = await getWatchlist()

    const watchlist = res.data.movies || []

    const movieDetails = await Promise.all(
      watchlist.map(async (item) => {
        const response = await getMovieById(item.movieId)

        return {
          ...response.data,
          movieId: item.movieId,
        }
      })
    )

    setMovies(movieDetails)

  } catch (err) {
    console.log("[v0] Failed to load watchlist:", err.message)
  } finally {
    setLoading(false)
  }
}

  async function handleRemove(movie) {
    const movieId = movie.movieId || movie.id || movie._id
    try {
      await removeFromWatchlist(movieId)
      // Remove it from the screen without refetching everything.
      setMovies((prev) =>
        prev.filter((m) => (m.movieId || m.id || m._id) !== movieId),
      )
    } catch (err) {
      console.log("[v0] Failed to remove from watchlist:", err.message)
    }
  }

  return (
    <div className="container page">
      <h1 className="section-title">My Watchlist</h1>

      {loading ? (
        <Loader text="Loading watchlist..." />
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <h2>Your watchlist is empty</h2>
          <p>Browse movies and add the ones you want to watch later.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => {
            const id = movie.movieId || movie.id || movie._id
            const title = movie.title || movie.name || "Untitled"
            const year = (movie.release_date || movie.releaseDate || "").slice(0, 4)

            return (
              <div key={id} className="movie-card">
                <Link to={`/movie/${id}`}>
                  <img
                    className="movie-card-poster"
                    src={getPosterUrl(movie) || "/placeholder.svg"}
                    alt={`${title} poster`}
                    loading="lazy"
                  />
                </Link>
                <div className="movie-card-body">
                  <Link to={`/movie/${id}`}>
                    <h3 className="movie-card-title">{title}</h3>
                  </Link>
                  {year && (
                    <div className="movie-card-meta">
                      <span>{year}</span>
                    </div>
                  )}
                  <button
                    className="btn btn-danger btn-block"
                    style={{ marginTop: "8px" }}
                    onClick={() => handleRemove(movie)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Watchlist
