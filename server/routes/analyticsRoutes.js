const express = require('express');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Get analytics for a specific restaurant
router.get(
    '/:restaurantId',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { restaurantId } = req.params;

        try {
            // Fetch all orders for the restaurant
            const orders = await Order.find({ restaurant: restaurantId });

            // Calculate total sales
            const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            // Calculate most popular items
            const itemCounts = {};
            orders.forEach((order) => {
                order.items.forEach((item) => {
                    itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
                });
            });

            const mostPopularItems = Object.entries(itemCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            // Calculate average feedback rating (if feedback is numeric)
            const feedbackRatings = orders
                .map((order) => parseFloat(order.feedback))
                .filter((rating) => !isNaN(rating));
            const averageRating =
                feedbackRatings.length > 0
                    ? feedbackRatings.reduce((sum, rating) => sum + rating, 0) / feedbackRatings.length
                    : null;

            // Respond with analytics data
            res.json({
                totalSales,
                mostPopularItems,
                averageRating,
                totalOrders: orders.length,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch analytics', error });
        }
    }
);

module.exports = router;
