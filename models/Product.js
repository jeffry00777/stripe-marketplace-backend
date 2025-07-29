const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  usage: { type: String, enum: ["new", "used"], required: true },
  sellerId: { type: String, required: true },
  images: [{ type: mongoose.Schema.Types.ObjectId }],
  stripeAccountId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
