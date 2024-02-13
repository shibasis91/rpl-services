const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Mongo connection error: "));

db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = db;
