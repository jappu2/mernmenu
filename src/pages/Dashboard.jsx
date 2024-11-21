import React, { useEffect, useState } from 'react';
import * as jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import StaffDashboard from './dashboards/StaffDashboard';

const Dashboard = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwt_decode(token);
            setRole(decoded.role); // Extract the role from the token
        } catch (error) {
            console.error('Invalid token:', error);
            navigate('/login'); // Redirect if token is invalid
        }
    }, [navigate]);

    const renderDashboard = () => {
        switch (role) {
            case 'Admin':
                return <AdminDashboard />;
            case 'RestaurantManager':
                return <ManagerDashboard />;
            case 'Staff':
                return <StaffDashboard />;
            default:
                return <p>Unauthorized: No dashboard available for this role.</p>;
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;
