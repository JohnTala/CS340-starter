const express = require("express")
const path = require("path")
require("dotenv").config()
const expressEjsLayouts = require("express-ejs-layouts")

const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")   

const app = express()

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressEjsLayouts)
app.set("layout", "layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.get("/", baseController.buildHome)
app.use("/inv", inventoryRoute)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

/* ***********************
 * 404 – Page Not Found
 * MUST be after all routes
 *************************/
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  })
})

/* ***********************
 * Global Error Handler
 * MUST be last middleware
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message: err.message,
    nav,
  })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Server
 *************************/
const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})


// const express = require("express")
// const path = require("path")
// require("dotenv").config()
// const expressEjsLayouts = require("express-ejs-layouts")

// const staticRoutes = require("./routes/static")
// const inventoryRoute = require("./routes/inventoryRoute")
// const baseController = require("./controllers/baseController")
// const utilities = require("./utilities")   

// const app = express()

// /* ***********************
//  * View Engine
//  *************************/
// app.set("view engine", "ejs")
// app.set("views", path.join(__dirname, "views"))
// app.use(expressEjsLayouts)
// app.set("layout", "layouts/layout")

// /* ***********************
//  * Middleware
//  *************************/
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())

// /* ***********************
//  * Routes
//  *************************/
// app.use(staticRoutes)
// app.get("/", baseController.buildHome) // Home route
// app.use("/inv", inventoryRoute)

// /* ***********************
//  * 404 – Page Not Found
//  * MUST be after all routes
//  *************************/
// app.use(async (req, res, next) => {
//   next({
//     status: 404,
//     message: "Sorry, we appear to have lost that page.",
//   })
// })

// /* ***********************
//  * Global Error Handler
//  * MUST be last middleware
//  *************************/
// app.use(async (err, req, res, next) => {
//   const nav = await utilities.getNav()
//   console.error(`Error at "${req.originalUrl}": ${err.message}`)

//   // Custom message for 404
//   const message = err.status === 404
//     ? err.message
//     : 'Oh no! There was a crash. Maybe try a different route?'

//   res.status(err.status || 500).render("errors/error", {
//     title: err.status || "Server Error",
//     message,
//     nav,
//   })
// })

// /* ***********************
//  * Server
//  *************************/
// const PORT = process.env.PORT || 3000

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`)
// })
