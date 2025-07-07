require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");

const apiRoutes = require("./routes/api");
const uploadRoutes = require("./routes/upload");
const errorHandler = require("./middlewares/errorHandler");

const server = http.createServer(app);

// WebSocket integration
require("./ws/socket")(server);

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => res.render("index", { name: "Developer" }));
app.use("/api", apiRoutes);
app.use("/upload", uploadRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
