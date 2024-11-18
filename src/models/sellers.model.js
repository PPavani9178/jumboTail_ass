const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    sellingPrice: { type: Number, required: true },
    attributes: {
        weight: { type: Number },
        dimension: { type: String }
    }
});

// Define the seller schema
const sellerSchema = new mongoose.Schema({
    sellerName: { type: String, required: true },
    product: productSchema,  
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
