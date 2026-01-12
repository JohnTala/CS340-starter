// routes/static.js
const express = require("express");
const path = require("path");
const router = express.Router();

// Serve all files in public folder
router.use(express.static(path.join(__dirname, "../public")));

module.exports = router;
