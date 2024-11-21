import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuQRCode = ({ restaurantId }) => {
    const [qrCode, setQrCode] = useState(null);

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const response = await axios.get(
                    `/api/restaurants/${restaurantId}/menu/qr`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );
                setQrCode(response.data.qrCode);
            } catch (error) {
                console.error('Failed to fetch QR code:', error);
            }
        };

        fetchQrCode();
    }, [restaurantId]);

    return (
        <div>
            <h2>Menu QR Code</h2>
            {qrCode ? (
                <img src={qrCode} alt="QR Code for Menu" />
            ) : (
                <p>Loading QR code...</p>
            )}
        </div>
    );
};

export default MenuQRCode;
