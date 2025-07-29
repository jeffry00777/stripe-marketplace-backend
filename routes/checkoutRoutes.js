const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const CLIENT_URL = process.env.CLIENT_URL;

router.post("/create-session", authMiddleware, async (req, res) => {
  const { productId, price, buyerId, address, phone, time } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product || !product.stripeAccountId) {
      return res.status(400).json({
        error: "Invalid product or missing seller Stripe account ID.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price * 100,
            product_data: {
              name: product.name || `Product ${productId}`,
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 100,
        transfer_data: {
          destination: product.stripeAccountId,
        },
      },
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}/cancel`,
      metadata: {
        productId,
        buyerId,
        address,
        phone,
        time,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

module.exports = router;
