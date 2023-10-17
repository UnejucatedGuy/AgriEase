const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth"); // Import your authentication middleware
const {
  createOrder,
  listOrders,
  getOrderById,
  listCustomerOrders,
  listOwnerOrders,
} = require("../controllers/order"); // Import your order controller

// Create a new order (authenticated route)
router.post("/create", authenticateUser, createOrder);

// Get a list of all orders (authenticated route)
router.get("/list", authenticateUser, listOrders);

// Get details of a specific order by ID (authenticated route)
router.get("/:orderId", authenticateUser, getOrderById);

// Get a list of orders for a specific customer (authenticated route)
router.get("/customer/:customerId", authenticateUser, listCustomerOrders);

// Get a list of orders by a specific owner (authenticated route)
router.get("/owner/:ownerId", authenticateUser, listOwnerOrders);

// Filter and sort orders by status (authenticated route)
router.get("/filter/status/:status", authenticateUser, filterOrdersByStatus);

module.exports = router;
