const express = require("express");
const router = express.Router();
const axios = require("axios");

// Simple public API fetch
router.get("/joke", async (req, res, next) => {
  try {
    const { data } = await axios.get("https://api.chucknorris.io/jokes/random");
    res.json({ joke: data.value });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
