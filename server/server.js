const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();
connectDB();

const app = express(); // Define app only ONCE here

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use routes *BEFORE* creating the server
const authRoutes = require('./routes/authRoutes');
console.log("Auth routes loaded:", authRoutes); 
app.use('/api/auth', authRoutes);

const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/api/restaurants', restaurantRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);


const server = http.createServer(app);
const io = socketIo(server);

// Set up the WebSocket connection
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('orderStatusChanged', (orderId, status) => {
        io.emit('orderStatusUpdated', { orderId, status });
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/analytics', analyticsRoutes);


