
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Vehicles";

    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("buildByClassificationId error: ", error);
    const nav = await utilities.getNav();
    res.render("./inventory/classification", {
      title: "Vehicles",
      nav,
      grid: '<p class="notice">Sorry, we could not load this classification.</p>'
    });
  }
};

/* ***************************
 * Build single vehicle detail view
 ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.invId; // make sure your route uses :invId
    const vehicle = await invModel.getInventoryById(inv_id);
    const nav = await utilities.getNav();

    if (!vehicle) {
      // Friendly fallback instead of 404 error
      return res.render("./inventory/detail", {
        title: "Vehicle Not Found",
        nav,
        vehicle: null,
      });
    }

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
    });
  } catch (error) {
    console.error("buildVehicleDetail error: ", error);
    const nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: "Error Loading Vehicle",
      nav,
      vehicle: null,
    });
  }
};

module.exports = invCont;

 