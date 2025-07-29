const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  contentType: String,
  data: Buffer,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", imageSchema);
