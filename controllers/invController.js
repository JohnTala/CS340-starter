const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ****************************************
 * Deliver Management View
 **************************************** */
invCont.buildManagementView = async (req, res) => {
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;

  // Fetch classifications for dashboard cards
  const classificationsData = await invModel.getClassifications();
  const vehicles = []; // optional: can fetch recent vehicles

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message,
    classifications: classificationsData,
    vehicles,
  });
};

/* ****************************************
 * Deliver Add Classification Form
 **************************************** */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;

  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "",
    message,
  });
};

/* ****************************************
 * Process Add Classification
 **************************************** */
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();
  const errors = [];
  const message = null;

  // Server-side validation
  if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
    errors.push({ msg: "Classification name must not be empty or contain special characters." });
  }

  if (errors.length > 0) {
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
      message,
    });
  }

  try {
    await invModel.addClassification(classification_name);
    req.flash("success", `Classification "${classification_name}" added successfully!`);
    res.redirect("/inv");
  } catch (err) {
    console.error(err);
    errors.push({ msg: "Failed to add classification. Please try again." });
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name,
      message,
    });
  }
};

/* ****************************************
 * Deliver Add Inventory Form
 **************************************** */
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const message = req.flash("success").join(" ") || null;

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    vehicle: {},
    message,
  });
};

/* ****************************************
 * Process Add Inventory
 **************************************** */
invCont.addInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const message = null;

  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const errors = [];

  // Server-side validation
  if (!classification_id) errors.push({ msg: "Please select a classification." });
  if (!inv_make || !/^[a-zA-Z0-9 ]+$/.test(inv_make)) errors.push({ msg: "Please enter a valid make." });
  if (!inv_model || !/^[a-zA-Z0-9 ]+$/.test(inv_model)) errors.push({ msg: "Please enter a valid model." });
  if (!inv_year || !/^\d{4}$/.test(inv_year)) errors.push({ msg: "Year must be 4 digits." });
  if (!inv_description) errors.push({ msg: "Description is required." });
  if (!inv_price || isNaN(inv_price)) errors.push({ msg: "Price must be a number." });
  if (!inv_miles || !/^\d+$/.test(inv_miles)) errors.push({ msg: "Miles must be digits only." });
  if (!inv_color) errors.push({ msg: "Color is required." });

  const vehicle = {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  };

  if (errors.length > 0) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      vehicle,
      message,
    });
  }

  try {
    await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );
    req.flash("success", `Vehicle "${inv_make} ${inv_model}" added successfully!`);
    res.redirect("/inv");
  } catch (err) {
    console.error(err);
    errors.push({ msg: "Failed to add vehicle. Please try again." });
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      vehicle,
      message,
    });
  }
};

/* ****************************************
 * Vehicles by Classification
 **************************************** */
invCont.buildByClassificationId = async (req, res) => {
  const classificationId = req.params.classificationId;
  const vehicles = await invModel.getInventoryByClassificationId(classificationId);
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;

  if (!vehicles || vehicles.length === 0) {
    return res.status(404).render("inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: '<p class="notice">No vehicles found for this classification.</p>',
      message,
    });
  }

  const className = vehicles[0].classification_name;
  const grid = utilities.buildClassificationGrid(vehicles);

  res.render("inventory/classification", {
    title: `${className} Vehicles`,
    nav,
    grid,
    message,
  });
};

/* ****************************************
 * Single Vehicle Detail
 **************************************** */
invCont.buildVehicleDetail = async (req, res) => {
  const invId = req.params.invId;
  const vehicle = await invModel.getInventoryById(invId);
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;

  if (!vehicle) {
    return res.status(404).render("errors/error", {
      title: "Vehicle Not Found",
      nav,
      message: "Sorry, that vehicle could not be found.",
    });
  }

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle,
    message,
  });
};

module.exports = invCont;
