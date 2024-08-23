import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/userorders`,
                {},
                { headers: { token } }
            );
            setData(response.data.data || []); // Ensure `data` is an array
        } catch (error) {
            console.error('Error fetching orders:', error);
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
                {data && data.length > 0 ? (
                    data.map((order, index) => (
                        <div key={index} className='my-orders-order'>
                            <img src={assets.parcel_icon} alt="" />
                            <p>
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, itemIndex) => (
                                        <React.Fragment key={itemIndex}>
                                            {item.name} X {item.quantity}
                                            {itemIndex < order.items.length - 1 && ' , '}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    'No items'
                                )}
                            </p>
                            <p>${order.amount}.00</p>
                            <p>items: {order.items ? order.items.length : 0}</p>
                            <p><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                ) : (
                    <p>No orders available</p>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
