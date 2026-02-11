const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// ===========================
// Inventory Management View
// Access via /inv
// ===========================
router.get("/", utilities.handleErrors(invController.buildManagementView));

// ===========================
// Add Classification
// ===========================
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  invValidate.classificationRules(), // optional validation rules
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// ===========================
// Add Inventory (Vehicle)
// ===========================
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// ===========================
// Vehicles by classification (full page view)
// ===========================
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// ===========================
// Single vehicle detail
// ===========================
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildVehicleDetail)
);

// ===========================
// Get Inventory for AJAX
// Returns JSON of vehicles for a classification
// ===========================
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// ===========================
// Edit Inventory
// ===========================
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

router.post("/update", utilities.handleErrors(invController.updateInventory));

// ===========================
// Delete Inventory (confirmation view)
// ===========================
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirmView));

router.post("/delete", utilities.handleErrors(invController.deleteInventory));

module.exports = router;
