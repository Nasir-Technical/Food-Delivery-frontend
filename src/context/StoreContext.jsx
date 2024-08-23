import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [loading, setLoading] = useState(false);

    const url = "https://mr-food-del.vercel.app/";

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
        const validCartItems = cartItems || {};
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
            if (Array.isArray(response.data.data)) {
                setFoodList(response.data.data);
            } else {
                console.error("Invalid data format:", response.data);
                setFoodList([]);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            setFoodList([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems(response.data.cartData || {});
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

    return (
        <StoreContext.Provider value={{
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
        }}>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    food_list && food_list.length > 0 ? (
                        food_list.map((item, index) => (
                            <div key={index}>
                                {/* Render food item */}
                            </div>
                        ))
                    ) : (
                        <p>No food items found</p>
                    )
                )}
            </div>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
