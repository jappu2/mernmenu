import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const MenuPage = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    
    // Customer details state
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        phone: '',
        tableNumber: '',
        paymentMethod: 'cash', // Default to 'cash'
    });

    const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(false);

    useEffect(() => {
        // Fetch the menu items from the backend
        const fetchMenu = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/restaurants/${restaurantId}/menu`);
                setMenuItems(data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchMenu();
    }, [restaurantId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    };

    const handleOrderSubmit = async () => {
        if (!isDetailsSubmitted) {
            alert("Please submit your details first.");
            return;
        }

        // Prepare the order details
        const orderDetails = {
            restaurantId,
            items: cart,
            customer: customerDetails,
            total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        };

        try {
            const { data } = await axiosInstance.post('/api/orders', orderDetails);
            console.log("Order placed successfully:", data);
            // Clear the cart after successful order submission
            setCart([]);
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <div>
            <h2>Menu</h2>

            {/* Customer Details Form */}
            {!isDetailsSubmitted && (
                <div>
                    <h3>Enter Your Details</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setIsDetailsSubmitted(true);
                        }}
                    >
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={customerDetails.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={customerDetails.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Table Number:</label>
                            <input
                                type="text"
                                name="tableNumber"
                                value={customerDetails.tableNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Payment Method:</label>
                            <select
                                name="paymentMethod"
                                value={customerDetails.paymentMethod}
                                onChange={handleChange}
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                            </select>
                        </div>
                        <button type="submit">Submit Details</button>
                    </form>
                </div>
            )}

            {/* Menu Display */}
            <div>
                {menuItems.map((item) => (
                    <div key={item._id}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>${item.price}</p>
                        <button onClick={() => addToCart(item)}>Add to Cart</button>
                    </div>
                ))}
            </div>

            {/* Cart Display */}
            <h3>Your Cart</h3>
            <div>
                {cart.map((item) => (
                    <div key={item._id}>
                        <p>{item.name} - ${item.price} x {item.quantity}</p>
                        <button onClick={() => removeFromCart(item._id)}>Remove</button>
                    </div>
                ))}
            </div>

            <button onClick={handleOrderSubmit} disabled={cart.length === 0}>
                Submit Order
            </button>
        </div>
    );
};

export default MenuPage;
