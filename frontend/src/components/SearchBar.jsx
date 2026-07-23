import { useState } from "react"

// A controlled search input. When the form is submitted it calls the
// onSearch function passed down from the parent (Home page).
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    // Send the trimmed query up to the parent.
    onSearch(query.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search for movies"
      />
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  )
}

export default SearchBar
