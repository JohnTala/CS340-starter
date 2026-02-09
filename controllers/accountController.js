const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

/* ============================
 * Deliver Login View
 * ============================ */
accountController.buildLogin = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
    success_messages: req.flash("success") || [],
    error_messages: req.flash("error") || [],
  })
}

/* ============================
 * Deliver Registration View
 * ============================ */
accountController.buildRegister = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
    success_messages: req.flash("success") || [],
    error_messages: req.flash("error") || [],
  })
}

/* ============================
 * Process Registration
 * ============================ */
accountController.registerAccount = async (req, res) => {
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists) {
    req.flash("error", "This email is already registered. Please log in or use another email.")
    return res.redirect("/account/register")
  }

  const hashedPassword = bcrypt.hashSync(account_password, 10)
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

  req.flash("error", "Registration failed. Please try again.")
  res.redirect("/account/register")
}

/* ============================
 * Process Login
 * ============================ */
accountController.accountLogin = async (req, res) => {
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getUserByEmail(account_email)

  if (!accountData) {
    req.flash("error", "Invalid credentials. Try again.")
    return res.redirect("/account/login")
  }

  const validPassword = await bcrypt.compare(account_password, accountData.account_password)
  if (!validPassword) {
    req.flash("error", "Invalid credentials. Try again.")
    return res.redirect("/account/login")
  }

  delete accountData.account_password
  const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600 * 1000,
  })

  res.redirect("/account/") //redirect to account management
}

/* ============================
 * Account Management View
 * ============================ */
accountController.buildAccountManagement = async (req, res) => {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData || {}

  res.render("account/account", {
    title: "Account Management",
    nav,
    success_messages: req.flash("success") || [],
    error_messages: req.flash("error") || [],
    accountData,
    loggedin: !!res.locals.loggedin,
    account_firstname: accountData.account_firstname || "User",
    account_type: accountData.account_type || "Client",
    account_id: accountData.account_id,
  })
}

/* ============================
 * Deliver Account Update View
 * ============================ */
accountController.buildAccountUpdate = async (req, res) => {
  const nav = await utilities.getNav()
  const { account_id } = req.params
  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("error", "Account not found.")
    return res.redirect("/account/")
  }

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    loggedin: true,
    success_messages: req.flash("success") || [],
    error_messages: req.flash("error") || [],
    errors: null,
  })
}

/* ============================
 * Process Account Info Update
 * ============================ */
accountController.updateAccountInfo = async (req, res) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists) {
    req.flash("error", "Email already in use.")
    return res.redirect(`/account/update/${account_id}`)
  }

  await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email)
  req.flash("success", "Account info updated successfully.")
  res.redirect("/account/")
}

/* ============================
 * Process Password Change
 * ============================ */
accountController.updateAccountPassword = async (req, res) => {
  const { account_id, account_password } = req.body
  const hashedPassword = bcrypt.hashSync(account_password, 10)
  await accountModel.updateAccountPassword(account_id, hashedPassword)
  req.flash("success", "Password updated successfully.")
  res.redirect("/account/")
}

/* ============================
 * Logout
 * ============================ */
accountController.logout = async (req, res) => {
  res.clearCookie("jwt")
  req.flash("success", "You have been logged out.")
  res.redirect("/")
}

module.exports = accountController
