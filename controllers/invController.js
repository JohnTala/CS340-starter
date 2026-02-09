

const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ****************************************
 * Deliver Management View
 **************************************** */
invCont.buildManagementView = async (req, res) => {
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;

  const classificationSelect = await utilities.buildClassificationList();

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    message,
    errors: null,
    classificationSelect,
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

  if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
    errors.push({
      msg: "Classification name must not be empty or contain special characters.",
    });
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
    req.flash(
      "success",
      `Classification "${classification_name}" added successfully!`
    );
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
  } = req.body;

  if (!inv_image) inv_image = "/images/vehicles/no-image.png";
  if (!inv_thumbnail) inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const errors = [];

  if (!classification_id) errors.push({ msg: "Please select a classification." });
  if (!inv_make || !/^[a-zA-Z0-9 ]+$/.test(inv_make))
    errors.push({ msg: "Please enter a valid make." });
  if (!inv_model || !/^[a-zA-Z0-9 ]+$/.test(inv_model))
    errors.push({ msg: "Please enter a valid model." });
  if (!inv_year || !/^\d{4}$/.test(inv_year))
    errors.push({ msg: "Year must be 4 digits." });
  if (!inv_description) errors.push({ msg: "Description is required." });
  if (!inv_price || isNaN(inv_price))
    errors.push({ msg: "Price must be a number." });
  if (!inv_miles || !/^\d+$/.test(inv_miles))
    errors.push({ msg: "Miles must be digits only." });
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
      parseInt(inv_year),
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id)
    );
    req.flash(
      "success",
      `Vehicle "${inv_make} ${inv_model}" added successfully!`
    );
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

/* ***************************
 *  Return Inventory by Classification As JSON
 ***************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ****************************************
 * Render the edit inventory page
 **************************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;

  const itemData = await invModel.getInventoryById(inv_id);

  if (!itemData) {
    req.flash("error", "Vehicle not found");
    return res.redirect("/inv");
  }

  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    message,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ****************************************
 * Build and deliver delete confirmation view
 **************************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();

  const itemData = await invModel.getInventoryById(inv_id);

  if (!itemData) {
    req.flash("error", "Vehicle not found");
    return res.redirect("/inv");
  }

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Update Inventory Data
 ***************************/
invCont.updateInventory = async function (req, res, next) {
  let {
    inv_id,
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

  if (Array.isArray(inv_id)) inv_id = inv_id[0];
  if (Array.isArray(classification_id)) classification_id = classification_id[0];
  inv_id = parseInt(inv_id);
  classification_id = parseInt(classification_id);

  if (!inv_image) inv_image = "/images/vehicles/no-image.png";
  if (!inv_thumbnail) inv_thumbnail = "/images/vehicles/no-image-tn.png";

  const nav = await utilities.getNav();
  const message = req.flash("success").join(" ") || null;
  const errors = [];

  if (!inv_make || !/^[a-zA-Z0-9 ]+$/.test(inv_make))
    errors.push({ msg: "Make is required and must be alphanumeric." });
  if (!inv_model || !/^[a-zA-Z0-9 ]+$/.test(inv_model))
    errors.push({ msg: "Model is required and must be alphanumeric." });
  if (!inv_year || !/^\d{4}$/.test(inv_year))
    errors.push({ msg: "Year must be 4 digits." });
  if (!inv_description)
    errors.push({ msg: "Description is required." });
  if (!inv_price || isNaN(inv_price))
    errors.push({ msg: "Price must be a number." });
  if (!inv_miles || !/^\d+$/.test(inv_miles))
    errors.push({ msg: "Miles must be digits only." });
  if (!inv_color) errors.push({ msg: "Color is required." });
  if (!classification_id)
    errors.push({ msg: "Classification is required." });

  if (errors.length > 0) {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    return res.status(400).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      errors,
      inv_id,
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
      message,
    });
  }

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_year),
      parseInt(inv_miles),
      inv_color,
      classification_id
    );

    if (updateResult) {
      req.flash(
        "success",
        `Vehicle ${inv_make} ${inv_model} updated successfully.`
      );
      return res.redirect("/inv/");
    } else {
      throw new Error("Update failed");
    }
  } catch (err) {
    console.error(err);
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.status(500).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      errors: [{ msg: "An error occurred. Please try again." }],
      inv_id,
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
      message,
    });
  }
};

/* ****************************************
 * Process Inventory Delete
 **************************************** */
invCont.deleteInventory = async function (req, res, next) {
  let { inv_id } = req.body;

  if (Array.isArray(inv_id)) inv_id = inv_id[0];
  inv_id = parseInt(inv_id);

  try {
    const deleteResult = await invModel.deleteInventory(inv_id);

    if (deleteResult) {
      req.flash("success", "Vehicle was successfully deleted.");
      return res.redirect("/inv/");
    } else {
      throw new Error("Delete failed");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "Delete failed. Please try again.");
    return res.redirect(`/inv/delete/${inv_id}`);
  }
};

module.exports = invCont;
