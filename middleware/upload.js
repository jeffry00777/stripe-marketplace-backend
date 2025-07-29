const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config();

// Configure GridFS Storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // MongoDB URI from .env
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);

        const filename = buf.toString("hex") + path.extname(file.originalname);

        const fileInfo = {
          filename: filename,
          bucketName: "images",
          metadata: {
            productId: req.productId || null,
          },
        };

        resolve(fileInfo);
      });
    });
  },
});

// Create the Multer middleware
const upload = multer({ storage });

module.exports = upload;
