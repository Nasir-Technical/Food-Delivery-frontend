import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = 'https://mr-foodi.vercel.app'; // Correct URL
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // Function to add item to cart
    const addToCart = async (itemId) => {
        const endpoint = `${url}/api/cart/add`;
        console.log(`Sending POST request to URL: ${endpoint}`); // Log the URL
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(endpoint, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error('Failed to add item to cart:', error);
            }
        }
    };

    // Function to remove item from cart
    const removeFromCart = async (itemId) => {
        const endpoint = `${url}/api/cart/remove`;
        console.log(`Sending POST request to URL: ${endpoint}`); // Log the URL
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
        if (token) {
            try {
                await axios.post(endpoint, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (error) {
                console.error('Failed to remove item from cart:', error);
            }
        }
    };

    // Function to calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // Function to fetch food list
    const fetchFoodList = async () => {
        const endpoint = `${url}/api/food/list`;
        console.log(`Fetching from URL: ${endpoint}`); // Log the URL
        try {
            const response = await axios.get(endpoint);
            setFoodList(response.data.data);
        } catch (error) {
            console.error('Failed to fetch food list:', error);
        }
    };

    // Function to load cart data
    const loadCartData = async (token) => {
        const endpoint = `${url}/api/cart/get`;
        console.log(`Sending POST request to URL: ${endpoint}`); // Log the URL
        try {
            const response = await axios.post(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error('Failed to load cart data:', error);
        }
    };

    // Fetch food list and cart data on component mount
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
