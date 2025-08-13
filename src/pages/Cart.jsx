import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ContextCreate } from "../context/ContextCreate";
import { useLoading } from "../context/LoadingContext";
import api from "../api";
export default function Cart() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCart, setCurrentCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("session"));
  const { setTotalamount, setCartCount } = useContext(ContextCreate);
  const token = localStorage.getItem("accessToken");
  const proceed = () => {
    navigate("/checkout");
    setTotalamount(total);
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api
      .get("products/")
      .then((res) => setProducts(res.data));
  }, []);

  const updateCart = async () => {
    if (!session) return navigate("/login");

    try {
      const res = await api.get(
        `cart/?userId=${session.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedCart = res.data;
      setCart(fetchedCart);
      setCartCount(fetchedCart.length);
      setLoading(false);
      // Map cart to include full product info
      const enrichedCart = fetchedCart.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          ...item,
          product,
        };
      });

      setCurrentCart(enrichedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    if (products.length) {
      updateCart();
    }
  }, [products]);

  useEffect(() => {
    let total = 0;
    currentCart.forEach((item) => {
      if (item.product) {
        total += item.product.price * item.quantity;
      }
    });
    setTotal(total);
  }, [currentCart]);

  const updateQuantity = (id, quantity) => {
    api
      .patch(
        `cart/${id}/`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setCart(
          cart.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        setCurrentCart(
          currentCart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
  };

  const removeItem = (id) => {
    api
      .delete(`cart/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        setCartCount(updatedCart.length);
        setCurrentCart(currentCart.filter((item) => item.id !== id));
      });
  };

  if (!cart.length) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          Your cart is empty.&nbsp;
          <Link to="/">Back to Home </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🛒 Your Shopping Cart</h2>
      <Row className="g-3">
        {currentCart.map((item) => {
          const product = item.product;

          return (
            <Col md={12} key={item.id}>
              <Card className="p-3 shadow-sm">
                <Row className="align-items-center">
                  <Col md={2} xs={4}>
                    <img
                      src={product?.image}
                      alt={product?.name}
                      className="img-fluid rounded"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col md={4} xs={8}>
                    <h5 className="mb-1">{product?.name}</h5>
                    <p className="text-muted mb-1">
                      ₹&nbsp;{product?.price} × {item.quantity}
                    </p>
                    <p className="fw-semibold mb-0 text-primary">
                      Subtotal: ₹&nbsp;
                      {(product?.price * item.quantity).toFixed(2)}
                    </p>
                  </Col>
                  <Col md={3} xs={6}>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                    />
                  </Col>
                  <Col md={3} xs={6} className="text-end">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Card className="mt-4 p-3 text-end shadow-sm">
        <h4 className="fw-bold">Total: ₹&nbsp;{total.toFixed(2)}</h4>
        <Button className="mt-3" variant="success" onClick={proceed}>
          Proceed to Checkout
        </Button>
      </Card>
    </Container>
  );
}
