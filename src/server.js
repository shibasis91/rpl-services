const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./route/authRoutes");
const { verifyAuthToken } = require("./middlewares/authMiddleware");
require("dotenv").config();
require("./config/db");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Ripple APIs");
});

app.get("/api/healthcheck", (req, res) => {
  res.json({ message: "OK" });
});

app.use("/api/auth", userRoutes);
app.get("/api/chat", verifyAuthToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("Server started at PORT: ", PORT);
});
