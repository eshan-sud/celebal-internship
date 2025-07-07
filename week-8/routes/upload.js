const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/file", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded", filename: req.file.filename });
});

module.exports = router;
