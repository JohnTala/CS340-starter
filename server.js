
const express = require("express");
const path = require("path");
require("dotenv").config();
const expressEjsLayouts = require("express-ejs-layouts");

// Controllers
const baseController = require("./controllers/baseController");

// Routes
const inventoryRoute = require("./routes/inventoryRoute");

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
app.use("/assets", express.static(path.join(__dirname, "public")));

// ===== Routes =====

// Home page
app.get("/", baseController.buildHome);

// Inventory pages (all /inv routes go through the router)
app.use("/inv", inventoryRoute);

// Catch-all 404 page (optional)
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
