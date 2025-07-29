const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { ObjectId } = require("mongodb");

// Initialize GridFS
let gfs;
let gridFSBucket;
mongoose.connection.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
});

// In-memory deleted map
const isDeleted = {};

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file;
  isDeleted[file.filename] = false;

  res.status(201).json({
    message: "Image uploaded",
    filename: file.filename,
    id: file.id,
  });
};

// GET all images for a productId
exports.getAllImagesByProductId = (req, res) => {
  const { productId } = req.params;

  gfs.files
    .find({ "metadata.productId": new mongoose.Types.ObjectId(productId) })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res
          .status(404)
          .json({ error: "No images found for this product" });
      }

      const filtered = files
        .filter((f) => !isDeleted[f.filename])
        .map((f) => ({
          filename: f.filename,
          id: f._id,
          contentType: f.contentType,
        }));

      res.json(filtered);
    });
};

// GET a single image by its GridFS ObjectID
exports.getImageById = (req, res) => {
  const { id } = req.params;

  gfs.files.findOne({ _id: new mongoose.Types.ObjectId(id) }, (err, file) => {
    if (!file || isDeleted[file.filename]) {
      return res.status(404).json({ error: "Image not found or deleted" });
    }

    const readStream = gfs.createReadStream({ _id: file._id });
    res.set("Content-Type", file.contentType);
    readStream.pipe(res);
  });
};

exports.ViewImageById = (req, res) => {
  try {
    if (!gridFSBucket) {
      console.error("GridFSBucket is not initialized yet.");
      return res.status(500).json({ error: "Server not ready. Try again." });
    }

    const fileId = new ObjectId(req.params.id);
    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType || "application/octet-stream");
    });

    downloadStream.on("error", (err) => {
      console.error("Download stream error:", err);
      res.status(404).json({ error: "Image not found" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Image view error:", err);
    res.status(400).json({ error: "Invalid image ID" });
  }
};

// DELETE image by GridFS ObjectID
exports.deleteImageById = (req, res) => {
  const { id } = req.params;

  gfs.files.findOne({ _id: new mongoose.Types.ObjectId(id) }, (err, file) => {
    if (!file) return res.status(404).json({ error: "File not found" });

    gfs.remove({ _id: file._id, root: "images" }, (err) => {
      if (err) return res.status(500).json({ error: "Delete failed" });

      isDeleted[file.filename] = true;
      res.json({ message: "Image deleted", filename: file.filename });
    });
  });
};
