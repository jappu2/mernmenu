const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if the user is authenticated
const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by decoded ID and exclude password from the result
            req.user = await User.findById(decoded.id).select('-password');

            // If the user doesn't exist anymore
            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is found
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to check if the user has the required role
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is authorized for this route
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next(); // Proceed to the next middleware or route handler
    };
};

module.exports = { protect, authorize };
