const mongoose = require("mongoose");
const User = require("./user"); // Import the User model

// Define a "Farmer" schema that extends the "User" schema
const farmerSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  storeDescription: {
    type: String,
    maxlength: 500,
  },
  location: {
    type: String,
    required: true,
    maxlength: 100,
  },
  storeLogo: {
    type: String,
  },
  // Add other fields specific to Farmers here
});

// Create the "Farmer" model by extending the "User" model
const Farmer = User.discriminator("Farmer", farmerSchema);

module.exports = Farmer;
