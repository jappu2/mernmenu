const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        tableNumber: { type: String },
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Completed', 'Canceled'],
        default: 'Pending',
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    feedback: { type: String },  // New field for feedback
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
