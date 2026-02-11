const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");

const validate = {};

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("A valid email is required.")
      .bail()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.");
        }
      }),

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
  ];
};

/* ******************************
 * Check registration data
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.render("account/register", {
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      message: null,
      errors: errors.array(), // array of { msg }
    });
  }
  next();
};

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
  ];
};

/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.render("account/login", {
      title: "Login",
      nav,
      account_email,
      message: null,
      errors: errors.array(),
    });
  }
  next();
};

/* **********************************
 * Update Account Info Validation Rules
 * ********************************* */
validate.updateInfoRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .notEmpty()
      .withMessage("A valid email is required.")
      .bail()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
      .custom(async (account_email, { req }) => {
        const accountExists = await accountModel.getAccountByEmail(account_email);
        if (accountExists && accountExists.account_id != req.body.account_id) {
          throw new Error("Email already in use by another account.");
        }
      }),
  ];
};

/* ******************************
 * Check Update Account Info
 * ***************************** */
validate.checkUpdateInfo = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: { account_id, account_firstname, account_lastname, account_email },
      message: null,
      errors: { accountInfo: errors.array(), password: [] }, // separate form errors
    });
  }
  next();
};

/* **********************************
 * Update Password Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty.")
      .bail()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check Update Password
 * ***************************** */
validate.checkUpdatePassword = async (req, res, next) => {
  const { account_id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: { account_id },
      message: null,
      errors: { accountInfo: [], password: errors.array() }, // separate form errors
    });
  }
  next();
};

module.exports = validate;
