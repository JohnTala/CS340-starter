const { body, validationResult } = require("express-validator");
const utilities = require(".");
// const invModel = require("../models/inventory-model");

const validate = {};

/* ================================
 * Classification Validation Rules
 * ================================ */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("Classification name is required.")
      .bail()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("No spaces or special characters allowed."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  const { classification_name } = req.body;

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
    });
  }
  next();
};

/* ================================
 * Inventory Validation Rules
 * ================================ */
validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Vehicle make is required."),
    body("inv_model").trim().notEmpty().withMessage("Vehicle model is required."),
    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .bail()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be a 4-digit number."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .bail()
      .isFloat({ min: 0 })
      .withMessage("Price must be a number."),
    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required.")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Miles must be a number."),
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(req.body.classification_id);

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      ...req.body, // sticky inputs
    });
  }
  next();
};

module.exports = validate;
