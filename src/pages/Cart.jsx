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

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("session"));
  const { setTotalamount } = useContext(ContextCreate);
  const { setCartCount } = useContext(ContextCreate);
  const proceed = () => {
    navigate("/checkout");
    setTotalamount(total);
  };
  useEffect(() => {
    if (!session) return navigate("/login");
    axios.get(`http://localhost:3000/cart?userId=${session.id}`).then((res) => {
      setCart(res.data);
      setCartCount(cart.length);
    });
  }, [session, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data));
  }, []);

  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    });
    setTotal(total);
  }, [cart, products]);

  const updateQuantity = (id, quantity) => {
    axios.patch(`http://localhost:3000/cart/${id}`, { quantity }).then(() => {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    });
  };

  const removeItem = (id) => {
    axios.delete(`http://localhost:3000/cart/${id}`).then(() => {
      setCart(cart.filter((item) => item.id !== id));
    });
    setCartCount(cart.length);
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
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);

          return (
            <Col md={12} key={item.id}>
              <Card className="p-3 shadow-sm">
                <Row className="align-items-center">
                  <Col md={2} xs={4}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid rounded"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col md={4} xs={8}>
                    <h5 className="mb-1">{product.name}</h5>
                    <p className="text-muted mb-1">
                      ₹&nbsp;{product.price} × {item.quantity}
                    </p>
                    <p className="fw-semibold mb-0 text-primary">
                      Subtotal: ₹&nbsp;
                      {(product.price * item.quantity).toFixed(2)}
                    </p>
                  </Col>
                  <Col md={3} xs={6}>
                    <Form.Control
                      type="number"
                      min={1}
                      value={item.quantity}
                      
                      onChange={(e) =>
                        updateQuantity(item.id, (e.target.value))
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
