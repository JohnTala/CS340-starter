// server.js
const express = require("express");
require("dotenv").config();
const expressEjsLayouts = require("express-ejs-layouts");
const staticRouter = require("./routes/static");

const app = express();

// View Engine
app.set("view engine", "ejs");
app.use(expressEjsLayouts);
app.set("layout", "./layouts/layout");

// Static Files
app.use("/", staticRouter);

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Start server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
