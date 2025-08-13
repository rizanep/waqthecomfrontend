import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import api from "../api";

export const ContextCreate = createContext();

export const ContextProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("session");
    try {
      return session ? JSON.parse(session) : null;
    } catch (e) {
      console.error("Failed to parse session from localStorage:", e);
      localStorage.removeItem("session"); 
      return null;
    }
  });

  const [totalamount, setTotalamount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [products,setProducts]=useState([])
  const [config,setConfig]=useState({})
  const navigate = useNavigate(); 
  const logout = () => {
  // 1. Clear user state immediately
  setUser(null); // Set to null, not "guest" string

  localStorage.clear()

  navigate("/login", { replace: true });

  
};

  const toggleWishlist = () => setShowWishlist((prev) => !prev);

  const handleWishlist = (item) => {
    const itemInWishlist = wishlist.find((wishItem) => wishItem.productId === item.id);
    if (itemInWishlist) {
      setWishlist(wishlist.filter((wishItem) => wishItem.productId !== item.id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
      
    if (user && user.id) { // Ensure user and user.id exist before making API calls
      api.get(`cart/?userId=${user.id}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      }).then((res) => {
        setCartCount(res.data.length);
      }).catch(error => console.error("Error fetching cart:", error));
      
      api
        .get(`wishlist/?userId=${user.id}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      })
        .then((res) => {
          setWishlist(res.data);

        }).catch(error => console.error("Error fetching wishlist:", error));
    } else {
      // If user logs out or is initially null, clear cart/wishlist counts
      setCartCount(0);
      setWishlist([]);
    }
    
      

  }, [user,sessionStorage]); // Depend on user state to refetch or clear data

  return (
    <ContextCreate.Provider
      value={{
        user,
        setUser,
        logout,
        totalamount,
        setTotalamount,
        wishlist,
        setWishlist,
        showWishlist,
        setShowWishlist,
        toggleWishlist,
        handleWishlist,
        cartCount,
        setCartCount,
        config
      }}
    >
      {children}
    </ContextCreate.Provider>
  );
};