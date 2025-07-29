// Temporary stub functions for now

exports.createOrder = async (req, res) => {
  try {
    res.status(201).json({ message: "Order created (stub)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    res.status(200).json({ message: `Fetch order ${orderId} (stub)` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
