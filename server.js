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
app.use(express.static(path.join(__dirname, "public"))); // serve public folder

// ===== Global Middleware for nav =====
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
    next();
  } catch (err) {
    console.error("Error building nav:", err);
    res.locals.nav = "<ul><li><a href='/'>Home</a></li></ul>";
    next();
  }
});

// ===== Routes =====
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);

// ===== 404 Page =====
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
