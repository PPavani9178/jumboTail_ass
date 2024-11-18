const mongoose = require('mongoose');

const deliverySpeedChargesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['deliverySpeedCharges'], // Ensuring it's always of this type
  },
  charges: {
    Standard: {
      type: Number,
      required: true,
    },
    Express: {
      type: Number,
      required: true,
    },
  },
});

// Create a model based on the schema
const DeliverySpeedCharges = mongoose.model('deliverycost', deliverySpeedChargesSchema);

module.exports = DeliverySpeedCharges;
