const Warehouse = require('../models/warehouses.model');
const redisClient = require('../utils/redisClient.utils');
const Seller = require('../models/sellers.model')
const geolib = require('geolib');



// Get all warehouses from DB with Redis cache
const getAllWarehouses = async (req, res) => {
    try {
        const cachedWarehouses = await redisClient.get('warehouses');
        
        if (cachedWarehouses) {
            return res.status(200).json(JSON.parse(cachedWarehouses));
        }
        
        const warehouses = await Warehouse.find();
        redisClient.setEx('warehouses', 3600, JSON.stringify(warehouses)); // Cache for 1 hour
        res.status(200).json(warehouses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new warehouse
const createWarehouse = async (req, res) => {
    const { warehouseId, location } = req.body;
    const newWarehouse = new Warehouse({ warehouseId, location });

    try {
        await newWarehouse.save();
        redisClient.del('warehouses'); // Invalidate cache
        res.status(201).json(newWarehouse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getNearestWarehouse = async (req, res) => {
    const { sellerId, productId } = req.query;

    try {
        // Generate a cache key based on sellerId or productId
        let cacheKey = `nearestWarehouse:${sellerId || productId}`;

        // Check cache first
        const cachedWarehouse = await redisClient.get(cacheKey);
        if (cachedWarehouse) {
            return res.status(200).json(JSON.parse(cachedWarehouse));
        }

        let sellerLocation = null;
        let productSellers = [];

        if (sellerId) {
            // If sellerId is provided, find the seller location
            const seller = await Seller.findById(sellerId);
            if (!seller) return res.status(404).json({ message: "Seller not found" });
            sellerLocation = seller.location;
        } else if (productId) {
            // If only productId is provided, find all sellers who have the product
            productSellers = await Seller.find({ "products.productId": productId });
            if (productSellers.length === 0) return res.status(404).json({ message: "No sellers found with this product" });
        }

        // Get all warehouse locations
        const warehouses = await Warehouse.find();
        let nearestWarehouse = null;
        let nearestDistance = Infinity;

        if (sellerLocation) {
            for (const warehouse of warehouses) {
                const distance = geolib.getDistance(sellerLocation, warehouse.location);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestWarehouse = warehouse;
                }
            }
        } else if (productSellers.length > 0) {
            for (const seller of productSellers) {
                const sellerLocation = seller.location;
                for (const warehouse of warehouses) {
                    const distance = geolib.getDistance(sellerLocation, warehouse.location);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestWarehouse = warehouse;
                    }
                }
            }
        }

        // Return nearest warehouse and cache the result
        if (nearestWarehouse) {
            const nearestWarehouseData = {
                warehouseId: nearestWarehouse._id,
                warehouseName: nearestWarehouse.warehouseName,
                warehouseLocation: nearestWarehouse.location
            };
            // Cache for 1 hour
            redisClient.setEx(cacheKey, 3600, JSON.stringify(nearestWarehouseData));
            return res.status(200).json(nearestWarehouseData);
        } else {
            return res.status(404).json({ message: "No nearest warehouse found" });
        }
    } catch (err) {
        console.error("Error in getNearestWarehouse:", err);
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getAllWarehouses, createWarehouse, getNearestWarehouse };
