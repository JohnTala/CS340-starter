const invModel = require("../models/inventory-models");
const utilities = require("../utilities/");

const invCont = {};

/* Vehicles by classification */
invCont.buildByClassificationId = async function (req, res) {
  try {
    const classificationId = req.params.classificationId;
    const vehicles = await invModel.getInventoryByClassificationId(classificationId);
    const nav = await utilities.getNav();
    const className = vehicles[0]?.classification_name || "Vehicles";

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      vehicles, // pass array to EJS
    });
  } catch (err) {
    console.error("buildByClassificationId error:", err);
    const nav = await utilities.getNav();
    res.render("inventory/classification", {
      title: "Vehicles",
      nav,
      vehicles: [], // empty array triggers notice
    });
  }
};

/* Single vehicle detail */
invCont.buildVehicleDetail = async function (req, res) {
  try {
    const invId = req.params.invId;
    const vehicle = await invModel.getInventoryById(invId);
    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: vehicle ? `${vehicle.inv_make} ${vehicle.inv_model}` : "Vehicle Not Found",
      nav,
      vehicle,
    });
  } catch (err) {
    console.error("buildVehicleDetail error:", err);
    const nav = await utilities.getNav();
    res.render("inventory/detail", {
      title: "Error Loading Vehicle",
      nav,
      vehicle: null,
    });
  }
};

module.exports = invCont;
