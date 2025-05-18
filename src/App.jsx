import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Badge,
  Offcanvas,
} from "react-bootstrap";
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
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import ProductListPage from "./pages/ProductListPage";
import axios from "axios";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

function Header() {
  const { cartCount } = useContext(ContextCreate);
  const { logout, user, wishlist, showWishlist, toggleWishlist, setWishlist } =
    useContext(ContextCreate);

  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("session"))
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSession(JSON.parse(localStorage.getItem("session")));
  }, [location]);

  const handleRemove = async (itemId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== itemId));
    await axios.delete(`http://localhost:3000/wishlist/${itemId}`);
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
        className="shadow py-1 px-5 mb-0 "
      >
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span className="fw-bold fs-4 mx-4 ">WAQTH</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {user && (
              <Nav.Link as={Link} to="/orders">
                Orders
              </Nav.Link>
            )}
            {user && (
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

            {user ? (
              <Nav.Link
                as={Link}
                to="/cart"
                className="d-flex align-items-center"
              >
                <FaShoppingCart className="me-1" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
            ) : (
              "null"
            )}

            {user ? (
              <>
                <NavDropdown
                  title={user.userName}
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link disabled className="text-light"></Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
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
            wishlist.map((item) => (
              <div
                key={item.id}
                className="mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center"
              >
                <div>
                  <div
                    className="fw-bold"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </div>
                  <div>₹ {item.price}</div>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default function App() {
  return (
    <div className="bg-wrapper">
      <BrowserRouter>
        <ContextProvider>
          <TopBar />
          <Header />

          <Container className="mt-4 max-vw-100 ">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/productlist" element={<ProductListPage />} />
            </Routes>
          </Container>
          <Footer />
        </ContextProvider>
      </BrowserRouter>
    </div>
  );
}
