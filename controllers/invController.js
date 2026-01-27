// const invModel = require("../models/inventory-model");
// const utilities = require("../utilities");

// const invCont = {};

// /* ****************************************
//  * Vehicles by classification
//  * Deduplicates strictly by inv_id
//  * Fixes image paths to /images/vehicles/
//  * Uses placeholder for missing images
//  **************************************** */
// invCont.buildByClassificationId = async (req, res) => {
//   try {
//     const classificationId = req.params.classificationId;

//     // Fetch vehicles
//     const vehicles = await invModel.getInventoryByClassificationId(classificationId) || [];

//     // Strict deduplication by inv_id
//     const uniqueVehicles = [];
//     const seenIds = new Set();

//     vehicles.forEach(v => {
//       if (!seenIds.has(v.inv_id)) {
//         seenIds.add(v.inv_id);

//         // Fix image path
//         if (!v.inv_image) {
//           v.inv_image = "/images/vehicles/placeholder.jpg";
//         } else if (!v.inv_image.startsWith("/images/vehicles/")) {
//           v.inv_image = "/images/vehicles/" + v.inv_image.split("/").pop();
//         }

//         uniqueVehicles.push(v);
//       }
//     });

//     const nav = await utilities.getNav();
//     const className = uniqueVehicles[0]?.classification_name || "Vehicles";

//     // Build HTML grid using utilities
//     const grid = await utilities.buildClassificationGrid(uniqueVehicles);

//     res.render("inventory/classification", {
//       title: `${className} Vehicles`,
//       nav,
//       grid,
//     });
//   } catch (error) {
//     console.error("Error in buildByClassificationId:", error);
//     res.status(500).send("Server Error");
//   }
// };

// /* ****************************************
//  * Single vehicle detail
//  **************************************** */
// invCont.buildVehicleDetail = async (req, res) => {
//   try {
//     const invId = req.params.invId;

//     // Fetch vehicle
//     const vehicle = await invModel.getInventoryById(invId);
//     const nav = await utilities.getNav();

//     if (!vehicle) {
//       return res.status(404).render("inventory/detail", {
//         title: "Vehicle Not Found",
//         nav,
//         vehicle: null,
//       });
//     }

//     // Fix image path
//     if (!vehicle.inv_image) {
//       vehicle.inv_image = "/images/vehicles/placeholder.jpg";
//     } else if (!vehicle.inv_image.startsWith("/images/vehicles/")) {
//       vehicle.inv_image = "/images/vehicles/" + vehicle.inv_image.split("/").pop();
//     }

//     res.render("inventory/detail", {
//       title: `${vehicle.inv_make} ${vehicle.inv_model}`,
//       nav,
//       vehicle,
//     });
//   } catch (error) {
//     console.error("Error in buildVehicleDetail:", error);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports = invCont;
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
