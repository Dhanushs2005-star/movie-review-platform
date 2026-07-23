/*
 * Shows a single review.
 * If the review belongs to the logged in user, we also show
 * Edit and Delete buttons.
 */
function ReviewCard({ review, isOwner, onEdit, onDelete }) {
  // Handle a few possible field names from the backend.
  const author =
    review.username ||
    review.userName ||
    (review.user && (review.user.username || review.user.name)) ||
    "Anonymous"

  const rating = review.rating
  const comment = review.comment || review.text || review.review || ""
  const date = (review.createdAt || review.date || "").slice(0, 10)

  return (
    <div className="review-card">
      <div className="review-card-head">
        <span className="review-author">{author}</span>
        {rating ? (
          <span className="rating">
            <span className="star">★</span>
            {rating}/10
          </span>
        ) : null}
      </div>

      {date ? (
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "8px" }}>
          {date}
        </p>
      ) : null}

      <p className="review-body">{comment}</p>

      {isOwner && (
        <div className="review-actions">
          <button className="btn btn-secondary" onClick={() => onEdit(review)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(review)}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewCard
