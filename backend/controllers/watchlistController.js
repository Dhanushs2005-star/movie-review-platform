const Watchlist = require("../models/Watchlist");

const addToWatchlist = async (req, res) => {
    try {

        const { movieId } = req.body;

        const alreadyExists = await Watchlist.findOne({
            user: req.user.id,
            movieId,
        });

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Movie already in watchlist",
            });
        }

        const movie = await Watchlist.create({
            user: req.user.id,
            movieId,
        });

        res.status(201).json({
            success: true,
            message: "Movie Added To Watchlist",
            movie,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const getWatchlist = async (req, res) => {
    try {

        const movies = await Watchlist.find({
            user: req.user.id,
        });

        res.json({
            success: true,
            movies,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

const removeFromWatchlist = async (req, res) => {
    try {

        await Watchlist.findOneAndDelete({
            user: req.user.id,
            movieId: req.params.movieId,
        });

        res.json({
            success: true,
            message: "Movie Removed",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist,
};