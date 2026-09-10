const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");

const getAdminstats = async (req, res) => {
  try {
    const isSeller = req.user.role === "seller";
    const totalUsers = isSeller ? 0 : await User.countDocuments({ role: "user" });
    const totalOrders = isSeller ? 0 : await Order.countDocuments();
    const totalProducts = await Product.countDocuments(
      isSeller ? { seller: req.user._id } : {}
    );

    const orders = isSeller ? [] : await Order.find();

    const totalRevenue = orders.reduce((total, order) => {
      return total + (order.totalAmount || 0);
    }, 0);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({
      message: "Error fetching admin statistics",
      error: error.message,
    });
  }
};

module.exports = { getAdminstats };