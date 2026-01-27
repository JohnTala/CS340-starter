const express = require("express");
const path = require("path");
require("dotenv").config();
const expressEjsLayouts = require("express-ejs-layouts");

// Controllers
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");

// Utilities
const utilities = require("./utilities");

const app = express();

// ===== View Engine =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressEjsLayouts);
app.set("layout", "layouts/layout");

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== Static Files =====
app.use(express.static(path.join(__dirname, "public")));

// ===== Global Middleware for Navigation =====
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (err) {
    console.error("Error building nav:", err);
    res.locals.nav = "<ul><li><a href='/'>Home</a></li></ul>";
  }
  next();
});

// ===== Routes =====

// Home page
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// ===== 404 Handler =====
app.use((req, res, next) => {
  const err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// ===== Express Error Handler =====
app.use(async (err, req, res, next) => {
  let nav;
  try {
    nav = await utilities.getNav();
  } catch {
    nav = "<ul><li><a href='/'>Home</a></li></ul>";
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
