const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, getOrderById } = require("../controllers/orderController");

router.use(authMiddleware);

// Save new order after successful payment
router.post("/", createOrder);

// View order by ID
router.get("/:id", getOrderById);

module.exports = router;
