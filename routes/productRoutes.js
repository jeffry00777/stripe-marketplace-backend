const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  deleteProduct,
} = require("../controllers/productController");

// Public routes
router.post(
  "/save",
  authMiddleware,
  (req, _res, next) => {
    console.log("req.auth =", req.auth); // should print decoded claims
    next();
  },
  upload.array("images", 5),
  createProduct
);
router.get("/seller/products", authMiddleware, getSellerProducts);
router.get("/:id", getProductById);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
