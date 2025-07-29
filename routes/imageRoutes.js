const express = require("express");
const router = express.Router();
const upload = require("../middleware/gridFsStorage");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadImage,
  getImageById,
  getAllImagesByProductId,
  deleteImageById,
  ViewImageById,
} = require("../controllers/imageController");

// Routes
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.get("/product/:productId", getAllImagesByProductId);
router.get("/:id", getImageById);
router.get("/:id/view", ViewImageById);
router.delete("/:id", authMiddleware, deleteImageById);

module.exports = router;
