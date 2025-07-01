const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit per IP
  message: "Too many requests. Please try again later.",
});

module.exports = limiter;
