require("module-alias").addAlias("@", __dirname + "/src");
require("dotenv").config();
const express = require("express");
const postRoutes = require("@/routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to BTNode-Day4 API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
