// Simple footer shown at the bottom of every page.
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          <strong style={{ color: "var(--accent)" }}>MovieReview</strong> &middot;
          Discover, review, and track your favorite movies.
        </p>
        <p>&copy; {new Date().getFullYear()} MovieReview. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
