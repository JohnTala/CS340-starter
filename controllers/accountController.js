const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");

const accountController = {};

/* ============================
 * Build Login View
 * GET /account/login
 * ============================ */
accountController.buildLogin = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    account_email: "", 
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ============================
 * Build Registration View
 * GET /account/register
 * ============================ */
accountController.buildRegister = async (req, res) => {
  const nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ============================
 * Build Account Management View
 * GET /account/
 * ============================ */
accountController.buildAccountManagement = async (req, res) => {
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData;

  res.render("account/account", {
    title: "My Account",
    nav,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type,
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ============================
 * Register Account
 * POST /account/register
 * ============================ */
accountController.registerAccount = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 12);
    await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);

    req.flash("success", "Registration successful. Please log in.");
    return res.redirect("/account/login");
  } catch (err) {
    console.error(err);
    return res.render("account/register", {
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      message: null,
      errors: [{ msg: "Email already exists or registration failed." }],
    });
  }
};

/* ============================
 * Login Account
 * POST /account/login
 * ============================ */
accountController.accountLogin = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const account = await accountModel.getAccountByEmail(account_email);

    if (!account) {
      return res.render("account/login", {
        title: "Login",
        nav,
        account_email,
        message: null,
        errors: [{ msg: "Invalid email or password." }],
      });
    }

    const passwordMatch = await bcrypt.compare(account_password, account.account_password);
    if (!passwordMatch) {
      return res.render("account/login", {
        title: "Login",
        nav,
        account_email,
        message: null,
        errors: [{ msg: "Invalid email or password." }],
      });
    }

    // Generate JWT
    const token = utilities.generateJWT(account);

    // Set JWT cookie (httpOnly)
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }); // 1 day

    req.flash("success", `Welcome back, ${account.account_firstname}!`);
    return res.redirect("/account");
  } catch (err) {
    console.error(err);
    return res.render("account/login", {
      title: "Login",
      nav,
      account_email,
      message: null,
      errors: [{ msg: "Login failed. Please try again." }],
    });
  }
};

/* ============================
 * Build Account Update View
 * GET /account/update/:account_id
 * ============================ */
accountController.buildAccountUpdate = async (req, res) => {
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData;

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ============================
 * Update Account Info
 * POST /account/update-info
 * ============================ */
accountController.updateAccountInfo = async (req, res) => {
  const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  try {
    const updated = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email);

    req.flash("success", "Account information updated successfully.");
    return res.redirect("/account");
  } catch (err) {
    console.error(err);
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      accountData: { account_id, account_firstname, account_lastname, account_email },
      message: null,
      errors: [{ msg: "Update failed. Email may already exist." }],
    });
  }
};

/* ============================
 * Update Account Password
 * POST /account/update-password
 * ============================ */
accountController.updateAccountPassword = async (req, res) => {
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 12);
    await accountModel.updateAccountPassword(account_id, hashedPassword);

    req.flash("success", "Password updated successfully.");
    return res.redirect("/account");
  } catch (err) {
    console.error(err);
    req.flash("error", "Password update failed.");
    return res.redirect(`/account/update/${account_id}`);
  }
};

/* ============================
 * Logout
 * GET /account/logout
 * ============================ */
accountController.logout = async (req, res) => {
  res.clearCookie("jwt");
  req.flash("success", "You have been logged out.");
  return res.redirect("/account/login");
};

module.exports = accountController;
