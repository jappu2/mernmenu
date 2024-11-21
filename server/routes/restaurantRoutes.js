const express = require('express');
const Restaurant = require('../models/Restaurant');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new restaurant
router.post(
    '/create',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { name, address, phone } = req.body;

        try {
            const restaurant = new Restaurant({
                name,
                address,
                phone,
                manager: req.user._id,
            });

            await restaurant.save();
            res.status(201).json(restaurant);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Get all restaurants for the logged-in manager
router.get(
    '/',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        try {
            const restaurants = await Restaurant.find({ manager: req.user._id });
            res.json(restaurants);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Add a menu item
router.post(
    '/:id/menu',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { id } = req.params;
        const { name, description, price, image } = req.body;

        try {
            const restaurant = await Restaurant.findById(id);

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }

            restaurant.menu.push({ name, description, price, image });
            await restaurant.save();

            res.status(201).json(restaurant.menu);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Get the menu of a specific restaurant
router.get(
    '/:id/menu',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { id } = req.params;

        try {
            const restaurant = await Restaurant.findById(id);

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.json(restaurant.menu);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Update a menu item
router.put(
    '/:restaurantId/menu/:menuItemId',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { restaurantId, menuItemId } = req.params;
        const { name, description, price, image } = req.body;

        try {
            const restaurant = await Restaurant.findById(restaurantId);

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const menuItem = restaurant.menu.id(menuItemId);

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            menuItem.name = name || menuItem.name;
            menuItem.description = description || menuItem.description;
            menuItem.price = price || menuItem.price;
            menuItem.image = image || menuItem.image;

            await restaurant.save();
            res.json(menuItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete a menu item
router.delete(
    '/:restaurantId/menu/:menuItemId',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { restaurantId, menuItemId } = req.params;

        try {
            const restaurant = await Restaurant.findById(restaurantId);

            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.manager.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const menuItem = restaurant.menu.id(menuItemId);

            if (!menuItem) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            menuItem.remove();
            await restaurant.save();

            res.json({ message: 'Menu item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

const QRCode = require('qrcode');

// Generate a QR code for the restaurant menu
router.get(
    '/:restaurantId/menu/qr',
    protect,
    authorize('RestaurantManager'),
    async (req, res) => {
        const { restaurantId } = req.params;

        try {
            // Define the menu URL (you can modify this to match your front-end route)
            const menuUrl = `http://localhost:3000/menu/${restaurantId}`;

            // Generate the QR code
            const qrCode = await QRCode.toDataURL(menuUrl);

            res.json({ menuUrl, qrCode });
        } catch (error) {
            res.status(500).json({ message: 'Failed to generate QR code', error });
        }
    }
);

module.exports = router;


module.exports = router;
