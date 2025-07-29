const Product = require("../models/Product");

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, usage, images, stripeAccountId } =
      req.body;

    const newProduct = new Product({
      name,
      description,
      price: parseInt(price),
      usage,
      sellerId: req.auth.sub,
      stripeAccountId,
      images,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });

  res.json(product);
};

// GET /api/seller/products
exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({});

  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const imageId = product.images?.[0];
      const imageUrl = imageId
        ? `https://stripe-marketplace-backend.onrender.com/api/images/${imageId}/view`
        : null;

      return {
        ...product.toObject(),
        imageUrl,
      };
    })
  );

  res.json(productsWithImages);
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.sellerId !== req.user.sub)
    return res.status(403).json({ error: "Not allowed" });

  await product.remove();
  res.json({ message: "Product deleted" });
};
