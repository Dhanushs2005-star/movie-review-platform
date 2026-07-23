import { Link, NavLink, useNavigate } from "react-router-dom"
import { isLoggedIn, clearAuth } from "../services/api"

// Top navigation bar. Shows different links depending on whether the
// user is logged in.
function Navbar() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  function handleLogout() {
    clearAuth()
    navigate("/login")
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span>M</span>ovieReview
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>

          {loggedIn && (
            <NavLink to="/watchlist" className="nav-link">
              Watchlist
            </NavLink>
          )}

          {loggedIn ? (
            <>
              <NavLink to="/profile" className="nav-link">
                Profile
              </NavLink>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
