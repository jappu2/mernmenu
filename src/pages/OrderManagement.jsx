// OrderManagement.js (Staff's Order Management UI)

import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders when component mounts
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get('/api/orders');
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axiosInstance.put(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map(order => order._id === orderId ? data : order));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const reportIssue = async (orderId, issue) => {
    try {
      const { data } = await axiosInstance.put(`/api/orders/${orderId}/issues`, { issues: issue });
      setOrders((prev) => prev.map(order => order._id === orderId ? data : order));
    } catch (error) {
      console.error("Error reporting issue:", error);
    }
  };

  return (
    <div>
      <h2>Order Management</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <div>
                <h4>Order from {order.customer.name}</h4>
                <p>Status: {order.status}</p>
                <p>Total: ${order.total}</p>
                <button onClick={() => updateOrderStatus(order._id, 'Preparing')}>Set as Preparing</button>
                <button onClick={() => updateOrderStatus(order._id, 'Completed')}>Set as Completed</button>
                <textarea 
                  placeholder="Report an issue"
                  onBlur={(e) => reportIssue(order._id, e.target.value)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderManagement;
