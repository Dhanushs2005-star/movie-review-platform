const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns=require('dns');
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

dns.setServers([
"8.8.8.8",
"1.1.1.1"
])

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies",movieRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/watchlist",watchlistRoutes);


const PORT = process.env.PORT || 5000;

// Test Route
app.get("/", (req, res) => {
  res.send("🎬 Movie Review API Running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});