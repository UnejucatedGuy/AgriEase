const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  products: [
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

  // Order Status: A field to represent the current status of the order
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], // Example order statuses
    default: "Pending",
    required: true,
  },
  totalAmount: {
    type: Number, // Store the total amount as a number
    required: true, // You may choose to make it required based on your business logic
  },

  // Add more order-specific fields here
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
