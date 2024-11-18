const geolib = require('geolib');
const Warehouse = require('../models/warehouses.model');
const Seller = require('../models/sellers.model'); // Assuming there’s a Seller model
const Customer = require('../models/customers.model');
const transportRates = require('../models/transportRate.model');
const deliverySpeedCharges = require('../models/deliverySpeedCharges.model');

const calculateShippingCharge = async (req, res) => {
    const { sellerId, customerId, deliverySpeed = "Standard" } = req.body;

    // Validate sellerId and customerId
    if (!sellerId || !customerId) {
        return res.status(400).json({ message: "Both sellerId and customerId are required" });
    }

    try {
        // Fetch seller and customer details
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const customer = await Customer.findOne({ customerId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Fetch all warehouses
        const warehouses = await Warehouse.find();
        if (!warehouses || warehouses.length === 0) {
            return res.status(404).json({ message: "No warehouses found" });
        }

        // Find the nearest warehouse by combined distance
        let nearestWarehouse = null;
        let minDistance = Infinity;

        warehouses.forEach((warehouse) => {
            const sellerToWarehouse = geolib.getDistance(
                { latitude: seller.location.lat, longitude: seller.location.lng },
                { latitude: warehouse.location.lat, longitude: warehouse.location.lng }
            );
            const warehouseToCustomer = geolib.getDistance(
                { latitude: warehouse.location.lat, longitude: warehouse.location.lng },
                { latitude: customer.location.lat, longitude: customer.location.lng }
            );

            const totalDistance = sellerToWarehouse + warehouseToCustomer;

            if (totalDistance < minDistance) {
                minDistance = totalDistance;
                nearestWarehouse = warehouse;
            }
        });

        if (!nearestWarehouse) {
            return res.status(500).json({ message: "Failed to find the nearest warehouse" });
        }

        // Fetch transport rates and delivery speed charges
        const transportRate = await transportRates.findOne({ type: "transportRates" });
        const deliveryCharges = await deliverySpeedCharges.findOne({ type: "deliverySpeedCharges" });

        if (!transportRate || !deliveryCharges) {
            return res.status(500).json({ message: "Transport or delivery charges not configured" });
        }

        // Extract transport rates and delivery charges
        const rates = transportRate.rates;
        const standardCharge = deliveryCharges.charges.Standard;
        const expressCharge = deliveryCharges.charges.Express;

        // Determine transport mode and rate
        let transportMode = "MiniVan";
        let rate = 3; // Default for MiniVan
        for (let i = 0; i < rates.length; i++) {
            if (minDistance >= rates[i].minDistance * 1000) {
                transportMode = rates[i].mode;
                rate = rates[i].rate;
            }
        }

        // Calculate base shipping charge
        const baseShippingCharge = minDistance * rate / 1000; // Distance in meters, rate in Rs/km/kg

        // Calculate final charge based on delivery speed
        let finalCharge = 0;
        if (deliverySpeed.toLowerCase() === "standard") {
            finalCharge = standardCharge + baseShippingCharge;
        } else if (deliverySpeed.toLowerCase() === "express") {
            finalCharge = standardCharge + (expressCharge * minDistance / 1000) + baseShippingCharge;
        } else {
            return res.status(400).json({ message: "Invalid deliverySpeed, valid options are 'Standard' or 'Express'" });
        }

        // Return response
        return res.status(200).json({
            shippingCharge: finalCharge.toFixed(2),
            nearestWarehouse: {
                warehouseId: nearestWarehouse._id,
                warehouseLocation: nearestWarehouse.location,
            },
        });
    } catch (err) {
        console.error("Error calculating shipping charge:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { calculateShippingCharge };
