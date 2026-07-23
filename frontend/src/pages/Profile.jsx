import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProfile, isLoggedIn } from "../services/api"
import ReviewCard from "../components/ReviewCard"
import Loader from "../components/Loader"

// Profile page: shows the logged in user's details and their reviews.
function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login")
      return
    }
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadProfile() {
    try {
      setLoading(true)
      const res = await getProfile()
      // Some backends wrap the user in res.data.user.
      setUser(res.data.user || res.data)
    } catch (err) {
      console.log("[v0] Failed to load profile:", err.message)
      setError("Could not load your profile.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container page">
        <Loader text="Loading profile..." />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container page">
        <div className="empty-state">
          <h2>Profile unavailable</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const username = user.username || user.name || "User"
  const email = user.email || "No email"
  const joined = (user.createdAt || user.joinedDate || "").slice(0, 10)
  // Reviews may or may not come back with the profile.
  const reviews = user.reviews || []
  // First letter for the avatar circle.
  const initial = username.charAt(0).toUpperCase()

  return (
    <div className="container page">
      {/* Profile header */}
      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div>
          <h1 className="profile-name">{username}</h1>
          <p className="profile-detail">{email}</p>
          {joined && <p className="profile-detail">Joined {joined}</p>}
        </div>
      </div>

      {/* My reviews */}
      <h2 className="section-title">My Reviews</h2>
      {reviews.length === 0 ? (
        <div className="empty-state">
          <h2>No reviews yet</h2>
          <p>Reviews you write will show up here.</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id || review._id}
              review={{ ...review, username }}
              isOwner={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile
