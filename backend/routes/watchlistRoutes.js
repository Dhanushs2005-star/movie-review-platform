const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
} = require("../controllers/watchlistController");

router.post("/", protect, addToWatchlist);

router.get("/", protect, getWatchlist);

router.delete("/:movieId", protect, removeFromWatchlist);

module.exports = router;