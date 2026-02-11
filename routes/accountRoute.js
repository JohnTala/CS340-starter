const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ======================
 * Login View
 * GET /account/login
 * ===================== */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* ======================
 * Registration View
 * GET /account/register
 * ===================== */
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/* ======================
 * Account Management View (requires login)
 * GET /account/
 * ===================== */
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

/* ======================
 * Process Login
 * POST /account/login
 * ===================== */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* ======================
 * Process Registration
 * POST /account/register
 * ===================== */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ======================
 * Account Update View
 * GET /account/update/:account_id
 * ===================== */
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

/* ======================
 * Update Account Info
 * POST /account/update-info
 * ===================== */
router.post(
  "/update-info",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.updateInfoRules(),
  regValidate.checkUpdateInfo,
  utilities.handleErrors(accountController.updateAccountInfo)
);

/* ======================
 * Update Account Password
 * POST /account/update-password
 * ===================== */
router.post(
  "/update-password",
  utilities.checkJWTToken,
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updateAccountPassword)
);

/* ======================
 * Logout
 * GET /account/logout
 * ===================== */
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
