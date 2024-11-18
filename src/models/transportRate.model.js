const mongoose = require('mongoose');

// Define the schema for transport costs configuration
const transportRatesSchema = new mongoose.Schema({
  type: { type: String, required: true, default: 'transportRates' }, 
  rates: [
    {
      mode: { type: String, required: true }, 
      rate: { type: Number, required: true }, 
      minDistance: { type: Number, required: true }, 
    },
  ],
});

module.exports = mongoose.model('transportcost', transportRatesSchema);
