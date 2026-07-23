const axios = require("axios");

const getPopularMovies = async (req, res) => {
    try {

        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`
        );

        res.status(200).json(response.data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getMovieDetails = async (req, res) => {
    try {

        const { id } = req.params;

        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
        );

        res.status(200).json(response.data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const searchMovies = async (req, res) => {
    try {

        const { query } = req.query;

        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`
        );

        res.status(200).json(response.data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    getPopularMovies,
    getMovieDetails,
    searchMovies
};