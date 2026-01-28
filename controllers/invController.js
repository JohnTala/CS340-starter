
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ****************************************
 * Vehicles by classification
 **************************************** */
invCont.buildByClassificationId = async (req, res, next) => {
  const classificationId = req.params.classificationId;

  const vehicles = await invModel.getInventoryByClassificationId(classificationId);

  if (!vehicles || vehicles.length === 0) {
    const nav = await utilities.getNav();
    return res.status(404).render("inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: '<p class="notice">No vehicles found for this classification.</p>',
    });
  }

  const className = vehicles[0].classification_name;
  const grid = utilities.buildClassificationGrid(vehicles);

  res.render("inventory/classification", {
    title: `${className} Vehicles`,
    grid,
  });
};

/* ****************************************
 * Single vehicle detail
 **************************************** */
invCont.buildVehicleDetail = async (req, res, next) => {
  const invId = req.params.invId;

  const vehicle = await invModel.getInventoryById(invId);

  if (!vehicle) {
    const nav = await utilities.getNav();
    return res.status(404).render("errors/error", {
      title: "Vehicle Not Found",
      nav,
      message: "Sorry, that vehicle could not be found.",
    });
  }

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    vehicle,
  });
};

module.exports = invCont;
