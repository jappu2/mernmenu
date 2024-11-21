import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsDashboard = ({ restaurantId }) => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`/api/analytics/${restaurantId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setAnalytics(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchAnalytics();
    }, [restaurantId]);

    if (!analytics) {
        return <p>Loading analytics...</p>;
    }

    return (
        <div>
            <h2>Restaurant Analytics</h2>
            <p><strong>Total Sales:</strong> ${analytics.totalSales.toFixed(2)}</p>
            <p><strong>Total Orders:</strong> {analytics.totalOrders}</p>
            <p>
                <strong>Average Feedback Rating:</strong>{' '}
                {analytics.averageRating ? analytics.averageRating.toFixed(1) : 'No feedback yet'}
            </p>
            <h3>Most Popular Items</h3>
            <ul>
                {analytics.mostPopularItems.map((item, index) => (
                    <li key={index}>
                        {item.name} - {item.count} sold
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnalyticsDashboard;
