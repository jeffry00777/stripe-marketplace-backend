const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");

const {
  createConnectLink,
  handleWebhook,
} = require("../controllers/stripeController");

// client-side request to start onboarding
router.post("/api/stripe/connect", requireAuth, createConnectLink);

// Stripe webhooks
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
