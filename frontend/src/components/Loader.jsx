// A simple full-width loading spinner used while data is being fetched.
function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  )
}

export default Loader
