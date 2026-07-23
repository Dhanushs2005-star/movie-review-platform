const express = require("express");

const router = express.Router();

const {
    getPopularMovies,
    getMovieDetails,
    searchMovies,
} = require("../controllers/movieController");

// Get popular movies
router.get("/popular", getPopularMovies);

// Search movies
router.get("/search", searchMovies);

// Get movie details by ID
router.get("/:id", getMovieDetails);

module.exports = router;