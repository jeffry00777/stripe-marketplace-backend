// server.js
require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Grid = require("gridfs-stream");

// Route imports
const productRoutes = require("./routes/productRoutes");
const imageRoutes = require("./routes/imageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Initialize GridFS
let gfs;
mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("images");
  console.log("GridFS initialized");
  global.gfs = gfs;
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use(stripeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Marketplace API is running");
});

// Start server
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
