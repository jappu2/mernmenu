const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all orders for the logged-in customer
router.get(
    '/orders',
    protect,
    async (req, res) => {
        try {
            const orders = await Order.find({ 'customer._id': req.user._id });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Submit feedback for a completed order
router.put(
    '/orders/:orderId/feedback',
    protect,
    async (req, res) => {
        const { orderId } = req.params;
        const { feedback } = req.body;

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (order.customer._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }

            order.feedback = feedback || order.feedback;
            await order.save();

            res.json({ message: 'Feedback submitted successfully', order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;
