import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]); // Initialize as an empty array
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await axios.post(`${url}/api/order/userorders`, {}, {
                headers: { token }
            });

            if (response.data && Array.isArray(response.data.data)) {
                setData(response.data.data); // Set data if it's an array
            } else {
                setData([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders');
            setData([]); // Set to empty array on error
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    Array.isArray(data) && data.length > 0 ? (
                        data.map((order, index) => (
                            <div key={index} className='my-orders-order'>
                                <img src={assets.parcel_icon} alt="Parcel Icon" />
                                <p>
                                    {order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return item.name + " X " + item.quantity;
                                        } else {
                                            return item.name + " X " + item.quantity + " , ";
                                        }
                                    })}
                                </p>
                                <p>${order.amount}.00</p>
                                <p>Items: {order.items.length}</p>
                                <p><span>&#x25cf;</span><b>{order.status}</b></p>
                                <button onClick={fetchOrders}>Track Order</button>
                            </div>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )
                )}
            </div>
        </div>
    );
};

export default MyOrders;
