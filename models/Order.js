const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyerId: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  time: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  stripeSessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
