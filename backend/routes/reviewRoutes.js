const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { addReview,getReviews,updateReview,deleteReview } = require("../controllers/reviewController");

router.post("/", protect, addReview);
router.get("/:movieId",getReviews);
router.put("/:id",protect,updateReview);
router.delete("/:id",protect,deleteReview);
module.exports = router;