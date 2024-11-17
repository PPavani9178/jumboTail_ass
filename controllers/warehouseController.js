const Warehouse = require('../models/Warehouse');
exports.getAllWarehouses=async(req,res)=>{
    try{
        const warehouses = await Warehouse.find();
        res.status(200).json(warehouses);
    }
    catch(error){
        res.status(500).json({error:'server error'});
    }
}