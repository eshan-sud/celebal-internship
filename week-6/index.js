require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const auth = require("./middleware/auth");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo Connection Error:", err));

// ===========================
// AUTH ROUTES
// ===========================

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send("User already exists");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @route POST /login
 * @desc Login a user and return a JWT
 * @access Public
 */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ===========================
// USER ROUTES (CRUD)
// ===========================

/**
 * @route GET /users
 * @desc Get all users
 * @access Protected
 */
app.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @route GET /user/:id
 * @desc Get user by ID
 * @access Protected
 */
app.get("/user/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @route PUT /user/:id
 * @desc Update user by ID
 * @access Protected
 */
app.put("/user/:id", auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!updated) return res.status(404).send("User not found");
    res.json(updated);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * @route DELETE /user/:id
 * @desc Delete user by ID
 * @access Protected
 */
app.delete("/user/:id", auth, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("User not found");
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    console.log("Request for delete completed.");
  }
});

// ===========================
// START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running at http://localhost:${process.env.PORT || 3000}`
  );
});
