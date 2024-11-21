const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.post(
    '/create',
    protect,
    async (req, res) => {
        const { name, phone, tableNumber, items, paymentMethod, restaurantId } = req.body;

        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            let totalAmount = 0;
            items.forEach(item => {
                totalAmount += item.price * item.quantity;
            });

            const order = new Order({
                customer: { name, phone, tableNumber },
                items,
                totalAmount,
                paymentMethod,
                restaurant: restaurantId,
            });

            await order.save();
            res.status(201).json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Get all orders for a restaurant (only accessible by staff and manager)
router.get(
    '/:restaurantId',
    protect,
    authorize('RestaurantManager', 'Staff'),
    async (req, res) => {
        const { restaurantId } = req.params;

        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            const orders = await Order.find({ restaurant: restaurantId });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Update the status of an order (Preparing, Completed, etc.)
router.put(
    '/:orderId/status',
    protect,
    authorize('RestaurantManager', 'Staff'),
    async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.status = status || order.status;
            await order.save();

            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Report an issue with an order
router.put(
    '/:orderId/report',
    protect,
    authorize('RestaurantManager', 'Staff'),
    async (req, res) => {
        const { orderId } = req.params;
        const { issue } = req.body;

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.issue = issue || order.issue;
            await order.save();

            res.json({ message: 'Issue reported successfully', order });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Import the WebSocket server (socket.io instance)
const { io } = require('../server');  // Adjust the import if necessary

// Update the status of an order (Preparing, Completed, etc.)
router.put(
    '/:orderId/status',
    protect,
    authorize('RestaurantManager', 'Staff'),
    async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;

        try {
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.status = status || order.status;
            await order.save();

            // Emit the event to notify all connected clients
            io.emit('orderStatusUpdated', { orderId, status });

            res.json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);


module.exports = router;
