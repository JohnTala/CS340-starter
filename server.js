const express = require("express")
require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressEjsLayouts = require("express-ejs-layouts")

app.set("view engine", "ejs")
app.use(expressEjsLayouts)
app.set("layout", "./layouts/layout")

app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

app.use("/public", static)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
