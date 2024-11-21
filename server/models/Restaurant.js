const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    menu: [
        {
            name: { type: String, required: true },
            description: { type: String },
            price: { type: Number, required: true },
            image: { type: String },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
