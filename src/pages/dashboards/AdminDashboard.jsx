import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Staff',
    });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axiosInstance.get('/api/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddUser = async () => {
        try {
            const { data } = await axiosInstance.post('/api/users', newUser);
            setUsers([...users, data]);
            setNewUser({ name: '', email: '', password: '', role: 'Staff' });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`/api/users/${userId}`);
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleUpdateUser = async () => {
        try {
            const { data } = await axiosInstance.put(`/api/users/${editingUser._id}`, editingUser);
            setUsers(
                users.map((user) =>
                    user._id === editingUser._id ? { ...user, ...data } : user
                )
            );
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>

            {/* New User Form */}
            <h2>Create New User</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddUser();
                }}
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={handleUserChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleUserChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleUserChange}
                    required
                />
                <select name="role" value={newUser.role} onChange={handleUserChange}>
                    <option value="Admin">Admin</option>
                    <option value="RestaurantManager">Restaurant Manager</option>
                    <option value="Staff">Staff</option>
                </select>
                <button type="submit">Add User</button>
            </form>

            {/* User List */}
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        <p>{user.name} ({user.email}) - Role: {user.role}</p>
                        <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                        <button onClick={() => handleEditUser(user)}>Edit</button>
                    </li>
                ))}
            </ul>

            {/* Edit User */}
            {editingUser && (
                <div>
                    <h2>Edit User</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateUser();
                        }}
                    >
                        <input
                            type="text"
                            name="name"
                            value={editingUser.name}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, name: e.target.value })
                            }
                        />
                        <input
                            type="email"
                            name="email"
                            value={editingUser.email}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, email: e.target.value })
                            }
                        />
                        <select
                            name="role"
                            value={editingUser.role}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, role: e.target.value })
                            }
                        >
                            <option value="Admin">Admin</option>
                            <option value="RestaurantManager">Restaurant Manager</option>
                            <option value="Staff">Staff</option>
                        </select>
                        <button type="submit">Update User</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
