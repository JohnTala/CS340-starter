/******************************
 * Account Controller
 ******************************/
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const accountController = {}

/* ============================
 * Deliver Login View
 * ============================ */
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: req.body?.account_email || "",
    success_messages: req.flash("success"),
    error_messages: req.flash("error"),
  })
}

/* ============================
 * Deliver Registration View
 * ============================ */
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
    success_messages: req.flash("success"),
    error_messages: req.flash("error"),
  })
}

/* ============================
 * Process Registration
 * ============================ */
accountController.registerAccount = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Check if email already exists
  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists) {
    req.flash("error", "This email is already registered. Please log in or use another email.")
    return res.redirect("/account/register")
  }

  // Hash the password before storing
  let hashedPassword
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    console.error(error)
    req.flash("error", "Sorry, there was an error processing your registration.")
    return res.redirect("/account/register")
  }

  // Store the user
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("success", `Congratulations ${account_firstname}! You're registered. Please log in.`)
    return res.redirect("/account/login")
  }

  // Fallback DB failure
  req.flash("error", "Sorry, the registration failed. Please try again.")
  return res.redirect("/account/register")
}

/* ============================
 * Process Login
 * ============================ */
accountController.accountLogin = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  // Check if the email exists
  const user = await accountModel.getUserByEmail(account_email)
  if (!user) {
    req.flash("error", "Email not found. Please check or register first.")
    return res.redirect("/account/login")
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(account_password, user.account_password)
  if (!passwordMatch) {
    req.flash("error", "Incorrect password. Please try again.")
    return res.redirect("/account/login")
  }

  // Successful login - store user info in session
  req.session.user = {
    id: user.account_id,
    email: user.account_email,
    firstname: user.account_firstname,
    lastname: user.account_lastname,
    type: user.account_type,
  }

  req.flash("success", `Welcome back, ${user.account_firstname}!`)
  res.redirect("/")
}

module.exports = accountController
