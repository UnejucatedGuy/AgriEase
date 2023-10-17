const mongoose = require("mongoose");
const User = require("./user"); // Import the User model

// Define a "Customer" schema that extends the "User" schema
const customerSchema = new mongoose.Schema({
  // Add fields specific to Customers here
  shoppingCart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to the Order model
    },
  ],
});

// Create the "Customer" model by extending the "User" model
const Customer = User.discriminator("Customer", customerSchema);

module.exports = Customer;
