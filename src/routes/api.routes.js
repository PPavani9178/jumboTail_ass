const express = require('express');
const warehouseController = require('../controllers/warehouse.controller');
const shippingController = require("../controllers/shipping.controller")
const calculateShipping = require("../controllers/calculateShipping.controller")
const router = express.Router();

// Warehouse Routes
router.get('/warehouses/nearest', warehouseController.getNearestWarehouse);
router.get('/warehouses', warehouseController.getAllWarehouses);
router.post('/warehouses', warehouseController.createWarehouse);

router.get('/shipping-charge', shippingController.getShippingCharge);
router.get('/shipping-charge/calculate', calculateShipping.calculateShippingCharge);

module.exports = router;
