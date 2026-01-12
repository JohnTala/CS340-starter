
const express = require("express");
const path = require("path");
require("dotenv").config();
const expressEjsLayouts = require("express-ejs-layouts");

const staticRoutes = require("./routes/static");

const app = express();

/* 
   View Engine
====================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressEjsLayouts);
app.set("layout", "layouts/layout");

/* 
   Middleware
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* 
   Routes
====================== */
app.use(staticRoutes);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

/*
   Server
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running on port ${PORT}`);
});
