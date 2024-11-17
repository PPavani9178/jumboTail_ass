const express=require('express');
const {getAllWarehouses}=require('../controllers/warehouseController');
const router=express.Router();
router.get('/warehouses', getAllWarehouses);
module.exports = router;