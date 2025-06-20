const express = require("express");
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());

// Route 1: Home
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

// Route 2: About
app.get("/about", (req, res) => {
  res.send("This is the About Page.");
});

// Route 3: Greet w/ query param
app.get("/greet", (req, res) => {
  const name = req.query.name || "Guest";
  res.send(`Hello, ${name}!`);
});

// Route 4: Echo posted JSON
app.post("/echo", (req, res) => {
  res.json({
    message: "Received your data!",
    data: req.body,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
