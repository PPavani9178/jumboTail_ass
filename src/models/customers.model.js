const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
});

const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;
