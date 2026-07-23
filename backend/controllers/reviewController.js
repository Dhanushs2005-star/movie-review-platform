const Review = require("../models/Review");

const addReview = async (req, res) => {

    try {

        const { movieId, rating, review } = req.body;

        // Prevent duplicate reviews
        const existingReview = await Review.findOne({
            movieId,
            user: req.user.id,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this movie.",
            });
        }

        const newReview = await Review.create({

            movieId,

            rating,

            review,

            user: req.user.id

        });

        res.status(201).json({

            success: true,

            message: "Review Added Successfully",

            newReview

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

const getReviews = async (req, res) => {
    try {

        const { movieId } = req.params;

        const reviews = await Review.find({ movieId })
            .populate("user", "username profileImage");

        res.status(200).json({
            success: true,
            reviews,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const updateReview = async (req, res) => {
    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // Only the owner can edit
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        review.rating = req.body.rating || review.rating;
        review.review = req.body.review || review.review;

        const updatedReview = await review.save();

        res.json({
            success: true,
            updatedReview
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteReview = async (req, res) => {
    try {

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        // Only owner can delete
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        await review.deleteOne();

        res.json({
            success: true,
            message: "Review Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports={

    addReview,
    getReviews,
    updateReview,
    deleteReview,

};