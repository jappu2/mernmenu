import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const OrderStatus = () => {
    const [orders, setOrders] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Establish the WebSocket connection
        const socketIo = io('http://localhost:5000');
        setSocket(socketIo);

        // Listen for order status updates
        socketIo.on('orderStatusUpdated', (data) => {
            console.log('Order status updated:', data);
            // Update the order status in your component/state
            setOrders((prevOrders) => 
                prevOrders.map((order) => 
                    order._id === data.orderId ? { ...order, status: data.status } : order
                )
            );
        });

        // Cleanup when the component unmounts
        return () => {
            socketIo.disconnect();
        };
    }, []);

    return (
        <div>
            <h2>Order Status</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order._id}>
                        Order ID: {order._id} - Status: {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderStatus;
