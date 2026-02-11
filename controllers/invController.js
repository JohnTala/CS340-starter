const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const statusOptions = ["Available", "Sold", "Reserved"];
const invCont = {};

/* ***************************
 * Inventory Management View
 *************************** */
invCont.buildManagementView = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const message = req.flash("success").join(" ") || null;
  const errors = req.flash("error") || [];

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    message,
    errors,
  });
};

/* ***************************
 * Add Classification View
 *************************** */
invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;
  const errors = req.flash("error") || [];

  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    message,
    errors,
  });
};

/* ***************************
 * Process Add Classification
 *************************** */
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;
  if (!classification_name) {
    req.flash("error", "Classification name is required.");
    return res.redirect("/inv/add-classification");
  }

  await invModel.addClassification(classification_name);
  req.flash("success", "Classification added successfully.");
  res.redirect("/inv");
};

/* ***************************
 * Add Inventory View
 *************************** */
invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const message = req.flash("success").join(" ") || null;
  const errors = req.flash("error") || [];

  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    message,
    errors,
    vehicle: {},
    statusOptions,
    selectedStatus: "Available",
  });
};

/* ***************************
 * Process Add Inventory
 *************************** */
invCont.addInventory = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  let {
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
    inv_status = "Available",
  } = req.body;

  // Default placeholders
  if (!inv_image) inv_image = "/images/vehicles/no-image.png";
  if (!inv_thumbnail) inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const errors = [];
  if (!inv_make) errors.push({ msg: "Make is required." });
  if (!inv_model) errors.push({ msg: "Model is required." });
  if (!inv_year || !/^\d{4}$/.test(inv_year)) errors.push({ msg: "Year must be 4 digits." });
  if (!inv_price || isNaN(inv_price)) errors.push({ msg: "Price must be numeric." });
  if (!inv_miles || isNaN(inv_miles)) errors.push({ msg: "Miles must be numeric." });
  if (!inv_color) errors.push({ msg: "Color is required." });
  if (!classification_id) errors.push({ msg: "Classification is required." });

  if (errors.length > 0) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      vehicle: req.body,
      message: null,
      statusOptions,
      selectedStatus: inv_status,
    });
  }

  await invModel.addInventory(
    inv_make,
    inv_model,
    parseInt(inv_year),
    inv_description,
    inv_image,
    inv_thumbnail,
    parseFloat(inv_price),
    parseInt(inv_miles),
    inv_color,
    parseInt(classification_id),
    inv_status
  );

  req.flash("success", `Vehicle "${inv_make} ${inv_model}" added successfully.`);
  res.redirect("/inv");
};

/* ***************************
 * Vehicles by Classification
 *************************** */
invCont.buildByClassificationId = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationId = parseInt(req.params.classificationId);

  // Fetch vehicles
  const vehicles = await invModel.getInventoryByClassificationId(classificationId);

  // Build HTML grid
  const grid = utilities.buildClassificationGrid(vehicles);

  res.render("inventory/classification", {
    title: "Vehicle Classification",
    nav,
    grid,
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ***************************
 * Vehicle Detail View
 *************************** */
invCont.buildVehicleDetail = async (req, res) => {
  const nav = await utilities.getNav();
  const invId = parseInt(req.params.invId);
  const vehicle = await invModel.getInventoryById(invId);

  if (!vehicle) {
    req.flash("error", "Vehicle not found.");
    return res.redirect("/inv");
  }

  // Ensure placeholders
  vehicle.inv_image = vehicle.inv_image?.trim() || "/images/vehicles/no-image.png";
  vehicle.inv_thumbnail = vehicle.inv_thumbnail?.trim() || "/images/vehicles/no-image-tn.png";

  res.render("inventory/detail", {
    title: `${vehicle.inv_make || "Vehicle"} ${vehicle.inv_model || ""}`,
    nav,
    vehicle,
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ***************************
 * Inventory JSON (AJAX)
 *************************** */
invCont.getInventoryJSON = async (req, res) => {
  const classification_id = parseInt(req.params.classification_id);
  const inventory = await invModel.getInventoryByClassificationId(classification_id);
  res.json(inventory);
};

/* ***************************
 * Edit Inventory View
 *************************** */
invCont.editInventoryView = async (req, res) => {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const vehicle = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(vehicle.classification_id);

  res.render("inventory/edit-inventory", {
    title: `Edit ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    classificationSelect,
    vehicle,
    statusOptions,
    selectedStatus: vehicle.inv_status,
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ***************************
 * Update Inventory
 *************************** */
invCont.updateInventory = async (req, res) => {
  const { inv_id, ...vehicleData } = req.body;
  const result = await invModel.updateInventory(
    parseInt(inv_id),
    vehicleData.inv_make,
    vehicleData.inv_model,
    vehicleData.inv_description,
    vehicleData.inv_image || "/images/vehicles/no-image.png",
    vehicleData.inv_thumbnail || "/images/vehicles/no-image-tn.png",
    parseFloat(vehicleData.inv_price),
    parseInt(vehicleData.inv_year),
    parseInt(vehicleData.inv_miles),
    vehicleData.inv_color,
    parseInt(vehicleData.classification_id),
    vehicleData.inv_status || "Available"
  );

  if (result) {
    req.flash("success", `Vehicle "${vehicleData.inv_make} ${vehicleData.inv_model}" updated successfully.`);
    res.redirect("/inv");
  } else {
    req.flash("error", "Update failed.");
    res.redirect("/inv");
  }
};

/* ***************************
 * Delete Confirmation View
 *************************** */
invCont.buildDeleteConfirmView = async (req, res) => {
  const nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const vehicle = await invModel.getInventoryById(inv_id);

  res.render("inventory/delete-confirm", {
    title: "Delete Vehicle",
    nav,
    vehicle,
    message: req.flash("success").join(" ") || null,
    errors: req.flash("error") || [],
  });
};

/* ***************************
 * Delete Inventory
 *************************** */
invCont.deleteInventory = async (req, res) => {
  const { inv_id } = req.body;
  await invModel.deleteInventory(parseInt(inv_id));
  req.flash("success", "Vehicle deleted successfully.");
  res.redirect("/inv");
};

module.exports = invCont;
