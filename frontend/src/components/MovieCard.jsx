import { Link } from "react-router-dom"

/*
 * Builds a usable poster image URL.
 * Different backends return the poster in different ways, so we handle the
 * common cases:
 *  - a full URL (starts with http)
 *  - a TMDB style path (starts with "/")
 *  - nothing at all -> use a placeholder
 */
function getPosterUrl(movie) {
  const path = movie.poster_path || movie.poster || movie.posterUrl
  if (!path) {
    return "https://placehold.co/300x450/1e1e1e/f5c518?text=No+Image"
  }
  if (path.startsWith("http")) {
    return path
  }
  return `https://image.tmdb.org/t/p/w342${path}`
}

// A single movie in the grid. Clicking it opens the details page.
function MovieCard({ movie }) {
  // The backend may use "id" or "_id" or "movieId".
  const id = movie.id || movie._id || movie.movieId
  const title = movie.title || movie.name || "Untitled"
  const rating = movie.vote_average ?? movie.rating
  const year =
    (movie.release_date || movie.releaseDate || "").slice(0, 4) || "N/A"

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <img
        className="movie-card-poster"
        src={getPosterUrl(movie) || "/placeholder.svg"}
        alt={`${title} poster`}
        loading="lazy"
      />
      <div className="movie-card-body">
        <h3 className="movie-card-title">{title}</h3>
        <div className="movie-card-meta">
          <span>{year}</span>
          {rating ? (
            <span className="rating">
              <span className="star">★</span>
              {Number(rating).toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
