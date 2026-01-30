// /******************************
//  * Account Controller
//  * ***************************/
// const utilities=require('../utilities')

// /*******************************
//  * Login view
//  *******************************/
// async function buildLogin(req,res,next){
//     let nav=await utilities.getNav()
//     res.render("account/login",{
//         title:"Login",
//         nav,
//     })

// }
// module.exports={buildLogin};

/******************************
 * Account Controller
 *******************************/
const utilities = require("../utilities")
const accountModel = require("../models/account-model")

const accountController = {}

/* Deliver Login View */
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* Process Login (placeholder) */
accountController.accountLogin = async function (req, res) {
  res.send("Login processing coming soon")
}

/* ===== Registration ===== */
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors:null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
  accountController. registerAccount=async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
module.exports = accountController

// const utilities = require("../utilities")
// const bcrypt = require("bcrypt")
// const accountModel = require("../models/account-model")

// const accountController = {}

// /* Deliver Login View */
// accountController.buildLogin = async function (req, res) {
//   const nav = await utilities.getNav()
//   res.render("account/login", {
//     title: "Login",
//     nav,
//     errors: null,
//   })
// }

// /* Process Login */
// accountController.accountLogin = async function (req, res) {
//   const { account_email, account_password } = req.body
//   const nav = await utilities.getNav()

//   const user = await accountModel.getUserByEmail(account_email)
//   if (!user) {
//     req.flash("error", "Email not found")
//     return res.redirect("/account/login")
//   }

//   const passwordMatch = await bcrypt.compare(account_password, user.password)
//   if (!passwordMatch) {
//     req.flash("error", "Password incorrect")
//     return res.redirect("/account/login")
//   }

//   // Auto-login
//   req.session.user = { id: user.id, email: user.email, firstname: user.firstname }
//   res.redirect("/")
// }

// /* Deliver Registration View */
// accountController.buildRegister = async function (req, res) {
//   const nav = await utilities.getNav()
//   res.render("account/register", {
//     title: "Register",
//     nav,
//     errors: null,
//   })
// }

// /* Process Registration */
// accountController.registerAccount = async function (req, res) {
//   const nav = await utilities.getNav()
//   const { account_firstname, account_lastname, account_email, account_password } = req.body

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(account_password, 10)

//   // Save to DB
//   const regResult = await accountModel.registerAccount(
//     account_firstname,
//     account_lastname,
//     account_email,
//     hashedPassword
//   )

//   if (regResult) {
//     // Auto-login after registration
//     req.session.user = { email: account_email, firstname: account_firstname }
//     res.redirect("/") // redirect to home page after registration
//   } else {
//     req.flash("error", "Sorry, the registration failed.")
//     res.status(501).render("account/register", {
//       title: "Register",
//       nav,
//       errors: ["Registration failed. Try again."],
//     })
//   }
// }

// module.exports = accountController
