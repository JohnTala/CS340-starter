const express = require("express")
const path = require("path")
require("dotenv").config()
const expressEjsLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require("./database")
const bodyParser = require("body-parser")

// Controllers & Routes
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

// Utilities
const utilities = require("./utilities")

const app = express()

/* ===== View Engine ===== */
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressEjsLayouts)
app.set("layout", "layouts/layout")

/* ===== Middleware ===== */
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
  })
)

app.use(require("connect-flash")())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

/* ===== Static Files ===== */
app.use(express.static(path.join(__dirname, "public")))

/* ===== Global Nav Middleware ===== */
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav()
  } catch (err) {
    console.error("Nav error:", err)
    res.locals.nav = "<ul><li><a href='/'>Home</a></li></ul>"
  }
  next()
})

/* ===== Routes ===== */
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

/* ===== 404 Handler ===== */
app.use((req, res, next) => {
  const err = new Error("File Not Found")
  err.status = 404
  next(err)
})

/* ===== Error Handler ===== */
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message:
      err.status === 404
        ? err.message
        : "Oh no! There was a server error.",
    nav,
  })
})

/* ===== Start Server ===== */
const PORT = process.env.PORT || 5500
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
