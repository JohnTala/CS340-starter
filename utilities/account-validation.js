

const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // First name
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    // Last name
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    // Email + custom DB check
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("A valid email is required.")
      .bail()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email")
        }
      }),

    // Password
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password does not meet requirements.")
      .bail()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email
    })
  }
  next()
}

/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .bail()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email
    })
  }

  next()
}

module.exports = validate
