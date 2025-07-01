require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const rateLimiter = require("./middleware/rateLimiter");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

app.use(cors());
app.use(express.json());
app.use(rateLimiter);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

app.listen(process.env.PORT, () =>
  console.log(`"Started" HTTP Server at http://localhost:${process.env.PORT}`)
);
