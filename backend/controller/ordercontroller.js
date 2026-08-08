const Order = require("../model/order");
const User = require("../model/user");
const sendEmail = require("../utils/sendEmail");

const createorder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            address,
            paymentId,
            paymentMethod,
            paymentStatus,
        } = req.body;

        if (
            !items ||
            items.length === 0 ||
            !totalAmount ||
            !address ||
            !paymentMethod
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const newOrder = new Order({
            user: user._id,
            items,
            totalAmount,
            address,
            paymentId: paymentId || "",
            paymentMethod,
            paymentStatus,
        });

        await newOrder.save();

        const message = `
Dear ${user.name},

Thank you for shopping with ShopDroby.

Your order has been placed successfully.

Order ID: ${newOrder._id}

Payment Method: ${paymentMethod}
Payment Status: ${paymentStatus}

Total Amount: ₹${totalAmount}

Shipping Address

Name: ${address.fullName}
Street: ${address.street}
City: ${address.city}
Postal Code: ${address.postalCode}
Country: ${address.country}

We will notify you once your order is shipped.

Thank you for shopping with us!

Team ShopDroby
`;

        await sendEmail(
            user.email,
            "Order Confirmation - ShopDroby",
            message
        );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message,
        });
    }
};

const myorders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate("items.productId", "name image price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

const getorders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.productId", "name image price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

const updateorderstatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message,
        });
    }
};

module.exports = {
    createorder,
    myorders,
    getorders,
    updateorderstatus,
};