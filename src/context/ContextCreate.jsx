import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ContextCreate = createContext();

export const ContextProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  });

  const [totalamount, setTotalamount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("session");
  };

  const toggleWishlist = () => setShowWishlist((prev) => !prev);

  const handleWishlist = (item) => {
    const itemInWishlist = wishlist.find((wishItem) => wishItem.id === item.id);
    if (itemInWishlist) {
      setWishlist(wishlist.filter((wishItem) => wishItem.id !== item.id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:3000/cart?userId=${user.id}`).then((res) => {
        setCartCount(res.data.length);
      });

      axios
        .get(`http://localhost:3000/wishlist?userId=${user.id}`)
        .then((res) => {
          setWishlist(res.data);
        });
    }
  }, [user]);

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
      }}
    >
      {children}
    </ContextCreate.Provider>
  );
};
