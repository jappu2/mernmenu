import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };
    
    useEffect(() => {
        if (!role) {
            navigate('/login');
        }
    }, [role, navigate]);

    return (
        <div>
            <h2>Dashboard</h2>
            {role === 'Admin' && <p>Welcome, Admin! Manage system-wide settings here.</p>}
            {role === 'RestaurantManager' && <p>Welcome, Manager! Manage your restaurant here.</p>}
            {role === 'Staff' && <p>Welcome, Staff! View and manage orders here.</p>}
            {role === 'Customer' && <p>Welcome, Customer! Browse menus and place orders.</p>}

            <button onClick={handleLogout}>Logout</button>

        </div>
    );
};

export default Dashboard;
