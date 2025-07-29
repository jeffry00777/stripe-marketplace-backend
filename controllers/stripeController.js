const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
require("dotenv").config();

exports.createConnectLink = async (req, res) => {
  try {
    const { existingAccountId } = req.body;

    const accountId =
      existingAccountId ||
      (await stripe.accounts.create({ type: "express" })).id;
    console.log("Using CLIENT_URL =", process.env.CLIENT_URL);

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.CLIENT_URL}/stripe/refresh`,
      return_url: `${process.env.CLIENT_URL}/stripe/return`,
      type: "account_onboarding",
    });
    res.json({ url: accountLink.url, accountId });
  } catch (err) {
    console.error("Stripe connect failed:", err.message);
    res.status(500).json({ error: "Stripe connect failed" });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );

      const newOrder = new Order({
        productId: session.metadata.productId,
        buyerId: session.metadata.buyerId,
        address: session.metadata.address,
        phone: session.metadata.phone,
        time: session.metadata.time,
        paymentMethod: paymentIntent.payment_method_types[0],
        stripeSessionId: session.id,
      });

      await newOrder.save();
      console.log("Order saved:", newOrder._id);
    } catch (err) {
      console.error("Order save failed:", err.message);
    }
  }

  res.status(200).json({ received: true });
};
