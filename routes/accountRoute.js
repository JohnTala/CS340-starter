const express = require("express")
const router = express.Router()

const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* ============================
 * Deliver Login View
 * ============================ */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ============================
 * Deliver Registration View
 * ============================ */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* ============================
 * Deliver Account Management View
 * Default route "/account/"
 * ============================ */
router.get(
  "/",
  utilities.checkJWTToken, // decode token if exists
  utilities.checkLogin,     // only allow logged-in users
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ============================
 * Process Login
 * ============================ */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ============================
 * Process Registration
 * ============================ */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ============================
 * Deliver Account Update View
 * ============================ */
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

/* ============================
 * Process Account Info Update
 * ============================ */
router.post(
  "/update-info",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountInfo)
)

/* ============================
 * Process Password Change
 * ============================ */
router.post(
  "/update-password",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountPassword)
)

/* ============================
 * Logout
 * ============================ */
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router
