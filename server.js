require("module-alias").addAlias("@", __dirname + "/src");
require("dotenv").config();
const express = require("express");
const postRoutes = require("@/routes/postRoutes");
const responseFormat = require("@/middlewares/responseFormat");
const notFoundHandler = require("@/middlewares/notFoundHandler");
const exceptionHandler = require("@/middlewares/exceptionHandler");
const { apiRateLimiter } = require("@/middlewares/rateLimiter");
const User = require("@/models/User");
const Post = require("@/models/Post");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database tables
const initializeDatabase = async () => {
  try {
    await User.createTable();
    console.log("Users table created successfully");
    await Post.createTable();
    console.log("Posts table created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};

// Middleware order: responseFormat first, then routes, then notFoundHandler and exceptionHandler
app.use(responseFormat);
app.use(express.json());
app.use(apiRateLimiter);

// Test routes
app.get("/test-success", (req, res) => {
  res.success({ message: "Hello World" });
});

app.get("/test-error", (req, res) => {
  throw new Error("Test exception");
});

// API routes
app.use("/api/posts", postRoutes);

// Root route
app.get("/", (req, res) => {
  res.success({ message: "Welcome to BTNode-Day4 API" });
});

// Error handling (must be last)
app.use(notFoundHandler);
app.use(exceptionHandler);

// Start server
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server is running on port ${PORT}`);
});
