// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const validate = require("../middleware/validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:inv_id", invController.buildByInvId);

// Route to trigger intentional error for testing
router.get("/error", invController.triggerError);

// Management route
router.get("/", invController.buildManagement);

// Add classification routes
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", 
  validate.classificationRules(),
  validate.checkClassificationData,
  invController.addClassification
);

// Add inventory routes
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  invController.addInventory
);

module.exports = router;