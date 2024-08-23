import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Directly set the URL here
    const url = "http://localhost:4000"; // Replace with your backend URL

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId }, { 
                    headers: { 'Authorization': `Bearer ${token}` } 
                });
            } catch (error) {
                console.error("Error adding item to cart:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedItems = { ...prev, [itemId]: prev[itemId] - 1 };
            if (updatedItems[itemId] <= 0) delete updatedItems[itemId];
            return updatedItems;
        });
        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { 'Authorization': `Bearer ${token}` } });
            } catch (error) {
                console.error("Error removing item from cart:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        const validCartItems = cartItems || {};  // Ensure cartItems is not null or undefined
        return Object.entries(validCartItems).reduce((totalAmount, [itemId, quantity]) => {
            if (quantity > 0) {
                const itemInfo = food_list.find((product) => product._id === itemId);
                if (itemInfo) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
            return totalAmount;
        }, 0);
    };

    const fetchFoodList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems(response.data.cartData || {}); // Ensure cartData is an object
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

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
        setToken,
        loading
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
