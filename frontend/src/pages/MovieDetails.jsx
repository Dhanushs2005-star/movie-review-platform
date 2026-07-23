import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getMovieById,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  addToWatchlist,
  isLoggedIn,
  getStoredUser,
} from "../services/api"
import ReviewCard from "../components/ReviewCard"
import Loader from "../components/Loader"

// ---- small helpers for images (backends return these in different shapes) ----
function getBackdropUrl(movie) {
  const path = movie.backdrop_path || movie.backdrop
  if (!path) return null
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w1280${path}`
}

function getPosterUrl(movie) {
  const path = movie.poster_path || movie.poster
  if (!path) return "https://placehold.co/300x450/1e1e1e/f5c518?text=No+Image"
  return path.startsWith("http") ? path : `https://image.tmdb.org/t/p/w342${path}`
}

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const currentUser = getStoredUser()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Review form state
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(8)
  const [editingId, setEditingId] = useState(null) // null = creating a new review
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState("")

  // Load movie + reviews whenever the id in the URL changes.
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadData() {
    try {
      setLoading(true)
      setError("")
      const [movieRes, reviewRes] = await Promise.all([
        getMovieById(id),
        getReviews(id),
      ])
      setMovie(movieRes.data)
      setReviews(reviewRes.data.reviews || [])
    } catch (err) {
      console.log("[v0] Failed to load movie details:", err.message)
      setError("Could not load this movie.")
    } finally {
      setLoading(false)
    }
  }

  // Refresh only the review list after adding/editing/deleting.
  async function refreshReviews() {
    try {
      const res = await getReviews(id)
      setReviews(res.data.reviews || [])
    } catch (err) {
      console.log("[v0] Failed to refresh reviews:", err.message)
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    setNotice("")
    try {
      if (editingId) {
       await updateReview(editingId, {
  rating,
  review: comment,
})
        setNotice("Review updated.")
      } else {
        await createReview({
    movieId: Number(id),
    rating,
    review: comment,
})
        setNotice("Review posted.")
      }
      // Reset the form.
      setComment("")
      setRating(8)
      setEditingId(null)
      refreshReviews()
    } catch (err) {
      console.log("[v0] Failed to submit review:", err.message)
      setNotice("Could not save your review.")
    } finally {
      setSubmitting(false)
    }
  }

  // Fill the form with an existing review so the user can edit it.
  function handleEdit(review) {
    setEditingId(review.id || review._id)
    setComment(review.review || "")
    setRating(review.rating || 8)
    // Scroll up to the form so the user sees it.
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleDelete(review) {
    const reviewId = review.id || review._id
    if (!window.confirm("Delete this review?")) return
    try {
      await deleteReview(reviewId)
      refreshReviews()
    } catch (err) {
      console.log("[v0] Failed to delete review:", err.message)
    }
  }

  async function handleAddToWatchlist() {
    try {
      await addToWatchlist({ movieId: id })
      setNotice("Added to your watchlist.")
    } catch (err) {
      console.log("[v0] Failed to add to watchlist:", err.message)
      setNotice("Could not add to watchlist.")
    }
  }

  if (loading) {
    return (
      <div className="container page">
        <Loader text="Loading movie..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h2>Movie not found</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Normalize fields.
  const title = movie.title || movie.name
  const overview = movie.overview || "No overview available."
  const runtime = movie.runtime
  const releaseDate = movie.release_date || movie.releaseDate
  const voteAverage = movie.vote_average ?? movie.rating
  const genres = movie.genres || []
  const backdrop = getBackdropUrl(movie)

  return (
    <div className="container page">
      {/* Backdrop */}
      {backdrop && (
        <div className="details-backdrop">
          <img src={backdrop || "/placeholder.svg"} alt="" />
        </div>
      )}

      {/* Header: poster + info */}
      <div className="details-header">
        <img
          className="details-poster"
          src={getPosterUrl(movie) || "/placeholder.svg"}
          alt={`${title} poster`}
        />

        <div className="details-info">
          <h1 className="details-title">{title}</h1>

          <div className="details-meta-row">
            {voteAverage ? (
              <span className="rating">
                <span className="star">★</span>
                {Number(voteAverage).toFixed(1)} / 10
              </span>
            ) : null}
            {releaseDate && <span>{releaseDate}</span>}
            {runtime ? <span>{runtime} min</span> : null}
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="details-meta-row">
              {genres.map((g) => (
                <span key={g.id || g} className="chip">
                  {g.name || g}
                </span>
              ))}
            </div>
          )}

          <p className="details-overview">{overview}</p>

          <div className="details-actions">
            {loggedIn ? (
              <button className="btn btn-primary" onClick={handleAddToWatchlist}>
                + Add to Watchlist
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={() => navigate("/login")}>
                Login to add to watchlist
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="reviews-section">
        <h2 className="section-title">Reviews</h2>

        {notice && <div className="success-msg">{notice}</div>}

        {/* Write review form (only for logged in users) */}
        {loggedIn ? (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <div className="rating-select">
              <label htmlFor="rating">Your rating:</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} / 10
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Share your thoughts about this movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Review"
                    : "Post Review"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null)
                    setComment("")
                    setRating(8)
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
            Please log in to write a review.
          </p>
        )}

        {/* Review list */}
        {reviews.length === 0 ? (
          <div className="empty-state">
            <h2>No reviews yet</h2>
            <p>Be the first to review this movie.</p>
          </div>
        ) : (
          <div className="review-list">
            {reviews.map((review) => {
              // Figure out if the current user owns this review.
              const reviewUserId =
                review.userId ||
                review.user?._id ||
                review.user?.id ||
                review.user
              const myId = currentUser?._id || currentUser?.id
              const isOwner = loggedIn && myId && reviewUserId === myId

              return (
                <ReviewCard
                  key={review.id || review._id}
                  review={review}
                  isOwner={isOwner}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default MovieDetails
