import React, { useContext, useEffect, useState,useCallback } from "react";
import { Link, useLocation, useNavigate, } from "react-router-dom";
import {
  Button,
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Badge,
  Offcanvas,
} from "react-bootstrap";
import {  useRef } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { ContextCreate, ContextProvider } from "./context/ContextCreate";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ProductListPage from "./pages/ProductListPage";
import AdminRoute from "./admin/AdminRoute";
import AdminPanel from "./admin/AdminPanel"; 
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";
import ProductManagement from './admin/ProductManagement';
import ProductDetails from "./admin/ProductDetails";
import UserManagement from "./admin/UserManagement";
import ViewOrders from "./admin/ViewOrders";
import Study from "./pages/Study";
import Profile from "./pages/Profile";
import useNotificationSocket from "./hooks/useNotificationSocket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";
import { useLoading } from "./context/LoadingContext";
import Loader from "./pages/Loader";
import { FaBell } from "react-icons/fa";
import { nav } from "framer-motion/client";
import api from "./api";
import { Toaster } from "react-hot-toast";

function Header() {
  const [expanded, setExpanded] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef();

const handleClickOutside = (event) => {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setDropdownOpen(false);
  }
};

useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  const {
    cartCount,
    logout,
    user,
    wishlist,
    showWishlist,
    toggleWishlist,
    setWishlist,
  } = useContext(ContextCreate);
  const token=localStorage.getItem("accessToken")
  const [nl,setNL]=useState(0)
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("session"))
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [products,setProducts]=useState([])
  let x;
useEffect(() => {
        window.scrollTo(0, 0);
  }, [session]);
  useEffect(() => {
    setSession(JSON.parse(localStorage.getItem("session")));
     fetchproducts()
      fetchNotifications()
  }, [location,setProducts,cartCount]);
const fetchproducts=async()=>{
  await api.get(`products/`)
      .then((res)=>{
        setProducts(res.data) 
})
}
const fetchNotifications = async () => {
    if (!session){
      return
    }

    try {
      const res = await api.get("notifications/", {
        params: { user_id: session.id }, 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNL(res.data.length);
      console.log("Fetched notifications:", res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
const handleNotificationMessage = useCallback((message) => {
          toast.info(message, {
              position: "top-right",
              autoClose: 5000,
          });
          console.log("i trigererd");
      }, []); // Empty dependency array means the function never changes

      // Pass the memoized function to the hook
      useNotificationSocket(user?.username, handleNotificationMessage);
const handleRemove = async (item) => {
  let deleteid;
    setWishlist((prev) => prev.filter((a) => a.productId !== item.productId));
    await api.get(`wishlist/?userId=${user.id}&productId=${item.productId}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      })
      .then((res)=>{
        deleteid=res.data[0].id
      })
    await api.delete(`wishlist/${deleteid}/`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
  };

  return (
    <>
    <ToastContainer />
    <Toaster position="top-right" reverseOrder={false} />
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow py-1 px-5 mb-0"
        expanded={expanded}
      >
        <Navbar.Brand as={Link} to={user?.role === 'admin' ? '/admin' : '/'} className="d-flex align-items-center">
          <span className="fw-bold fs-4 mx-4">WAQTH</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" 
        onClick={() => setExpanded(expanded ? false : true)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {user && user.role === 'user' && (
              <Nav.Link as={Link} to="/orders" onClick={() => setExpanded(false)}>
                Orders
              </Nav.Link>
            )}

            {/*   */}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/products" onClick={() => setExpanded(false)}>
                Manage Products
              </Nav.Link>
            )}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/users" onClick={() => setExpanded(false)}>
                Manage Users
              </Nav.Link>
            )}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/orders" onClick={() => setExpanded(false)}>
                View Orders
              </Nav.Link>
            )}

            {user?.role === "user"  && (
              <Nav.Link
                onClick={toggleWishlist}
                
                className="d-flex align-items-center me-0"
                style={{ cursor: "pointer" }}
              >
                <FaHeart className="me-1" />
                <span>Wishlist</span>
                {wishlist.length > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {wishlist.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {user && user.role === 'user' ? (
              <Nav.Link
                as={Link}
                to="/cart"
                className="d-flex align-items-center"
                onClick={() => setExpanded(false)}
              >
                <FaShoppingCart className="me-1" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
            ) : null}
            

            {user ? (
              <>
                <NavDropdown
  title={user.name}
  id="user-dropdown"
  align="end"
  show={dropdownOpen}            // control visibility
  onClick={() => setDropdownOpen(!dropdownOpen)} // toggle
  ref={dropdownRef}             // ref for outside click detection
>
  <NavDropdown.Item
    onClick={() => {
      logout();
      navigate("/login");
      setDropdownOpen(false); // close after logout
      setExpanded(false)
    }}
  >
    Logout
  </NavDropdown.Item>
  <NavDropdown.Item
    onClick={() => {
      navigate("/profile");
      setDropdownOpen(false);
      setExpanded(false) // close after navigating
    }}
  >
    Profile
  </NavDropdown.Item>
</NavDropdown>

              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)}>
                  Login
                </Nav.Link>
                {/* <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link> */}
                {/* <Nav.Link as={Link} to="/admin/login">
                  Admin
                </Nav.Link> */}
              </>
            )}
            {user?(<Nav.Link
                as={Link}
                to="/notifications"
                className="d-flex align-items-center"
                onClick={() => setExpanded(false)}
              >
                <FaBell className="me-1" />
                {nl > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {nl}
                  </Badge>
                )}
               
              </Nav.Link>):(null)}
            
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Offcanvas
        show={showWishlist}
        onHide={toggleWishlist}
        placement="end"
        style={{ width: "300px" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Wishlist</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {wishlist.length === 0 ? (
            <p className="text-muted">Your wishlist is empty.</p>
          ) : (
            wishlist.map((item) => {
  const product = products.find((a) => item.productId === a.id);
  if (!product) return null; // Or show loading fallback

  return (
    <div
      key={item.productId}
      className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center "
    >
      <div className="cursor-pointer">
        <div
          className="fw-bold cursor-pointer"
          onClick={() => navigate(`/product/${item.productId}`)}
        >
          {product.name}
        </div>
        <div>₹ {product.price}</div>
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => handleRemove(item)}
      >
        Remove
      </Button>
    </div>
  );
})

          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default function App() {
   const { loading } = useLoading();
  return (
    <div className="d-flex flex-column min-vh-100">
    <div className="bg-wrapper">
      
      <BrowserRouter>
        <ContextProvider>
          {loading && <Loader />}
          <TopBar />
          <Header />
          <Container className="mt-4 max-vw-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/productlist" element={<ProductListPage />} />
              <Route path="/forgot-password"element={<ForgotPassword />} />
              <Route path="/reset-password"element={<ResetPassword />} />
              <Route path="/notifications" element={<Notifications />}/>
              <Route path="/study" element={<Study/>}/>
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} /> 
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/products/:id" element={<ProductDetails/>} />
                <Route path="/admin/users" element={<UserManagement/>}/>
                <Route path="/admin/orders" element={<ViewOrders/>}/>
              </Route>
            </Routes>
          </Container>
          <Footer />
        </ContextProvider>
      </BrowserRouter>
    </div>
    </div>
  );
}