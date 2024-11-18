const geolib = require('geolib');
const Warehouse = require('../models/warehouses.model');
const Customer = require('../models/customers.model');
const transportRates = require('../models/transportRate.model'); 
const deliverySpeedCharges = require('../models/deliverySpeedCharges.model.js'); 

const getShippingCharge = async (req, res) => {
    const { warehouseId, customerId, deliverySpeed = "Standard" } = req.query;

    // Validate warehouseId and customerId are provided
    if (!warehouseId || !customerId) {
        return res.status(400).json({ message: "Both warehouseId and customerId are required" });
    }

    try {
        // Fetch warehouse by warehouseId
        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        // Fetch customer by customerId
        const customer = await Customer.findOne({ customerId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Get transport rates and delivery speed charges
        const transportRate = await transportRates.findOne({ type: "transportRates" });
        const deliveryCharges = await deliverySpeedCharges.findOne({ type: "deliverySpeedCharges" });

        // Extract transport rates and delivery speed charges
        const rates = transportRate.rates;
        const standardCharge = deliveryCharges.charges.Standard;
        const expressCharge = deliveryCharges.charges.Express;

        // Calculate distance between warehouse and customer
        const distance = geolib.getDistance(
            { latitude: warehouse.location.lat, longitude: warehouse.location.lng },
            { latitude: customer.location.lat, longitude: customer.location.lng }
        );

        // Determine transport mode based on distance
        let transportMode = "MiniVan";
        let rate = 3; // Default for MiniVan

        // Check transport mode based on distance
        for (let i = 0; i < rates.length; i++) {
            if (distance >= rates[i].minDistance * 1000) {
                transportMode = rates[i].mode;
                rate = rates[i].rate;
            }
        }

        // Calculate base shipping charge (distance * rate per km per kg)
        const baseShippingCharge = distance * rate / 1000; // Distance in meters, rate in Rs per km per kg

        // Calculate final charge based on delivery speed
        let finalCharge = 0;
        if (deliverySpeed === "Standard") {
            finalCharge = standardCharge + baseShippingCharge;
        } else if (deliverySpeed === "Express") {
            finalCharge = standardCharge + (expressCharge * distance / 1000) + baseShippingCharge;
        } else {
            return res.status(400).json({ message: "Invalid deliverySpeed, valid options are 'Standard' or 'Express'" });
        }

        // Return shipping charge in response
        return res.status(200).json({
            shippingCharge: finalCharge.toFixed(2)
        });
    } catch (err) {
        console.error("Error calculating shipping charge:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = { getShippingCharge };
