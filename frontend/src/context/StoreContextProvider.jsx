import React, { useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
import StoreContext from "../context/StoreContext";
import axios from "axios";



const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000"; // ✅ Fixed capitalization
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]); // ✅ Ensure it’s initialized as an array

const addToCart = async (itemId) => {
  if (!itemId) {
    console.error("Invalid itemId:", itemId); // Debugging
    return;
  }

  setCartItems((prev) => ({
    ...prev,
    [itemId]: (prev[itemId] ? Number(prev[itemId]) : 0) + 1, 
  }));

  if (token) {
    try {
      const response = await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }
};


  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}))
    if(token){
      await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find(
          (product) => String(product._id) === String(item) // ✅ Ensure proper comparison
        );
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  // ✅ Updated API Call with Error Handling
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");

      setFoodList(response.data.data || []); // Ensure it’s an array
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodList([]); // Set an empty list in case of error
    }
  };

  const loadCartData=async(token)=>{
    const response=await axios.post(`${url}/api/cart/get`,{},{headers:{token}});
    //to save cartData in one variable
    setCartItems(response.data.cartData);
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
     
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  },);

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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
