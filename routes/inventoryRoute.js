const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// Vehicle detail page
router.get("/detail/:invId", invController.buildVehicleDetail);

module.exports = router;
