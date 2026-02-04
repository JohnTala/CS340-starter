
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Add Inventory (Vehicle)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));

// Vehicles by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Single vehicle detail
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail));

module.exports = router;
