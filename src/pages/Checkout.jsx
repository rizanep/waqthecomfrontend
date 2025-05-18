import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ContextCreate } from "../context/ContextCreate";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    zip: "",
  });

  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("session"));
  const { totalamount, setCartCount } = useContext(ContextCreate);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3000/cart?userId=${session.id}`).then((res) => {
      setCart(res.data);
    });
    axios.get("http://localhost:3000/products").then((res) => {
      setProducts(res.data);
    });
  }, [navigate, session]);

  const handlePayment = async () => {
    window.scrollTo(0, 0);

    if (
      !address.name ||
      !address.phone ||
      !address.addressLine ||
      !address.city ||
      !address.zip
    ) {
      setMessage("Please fill in all address fields.");
      return;
    }

    try {
      for (const item of cart) {
        await axios.post("http://localhost:3000/orders", {
          userId: session.id,
          productId: item.productId,
          quantity: item.quantity,
          date: new Date().toISOString(),
          deliveryDetails: { ...address },
        });
        await axios.delete(`http://localhost:3000/cart/${item.id}`);
      }

      setCart([]);
      setCartCount(0);
      setPaymentDone(true);
      setMessage("Payment successful! Your order has been placed.");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error processing payment:", error);
      setMessage("There was an issue with the payment. Please try again.");
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <Container className="py-5">
      <Card className="p-4">
        <h3 className="mb-4">Place Your Order</h3>

        <p>
          Total Amount: <strong>₹&nbsp;{totalamount}</strong>
        </p>

        <h5 className="mt-4">Delivery Details</h5>
        <Form className="mb-4">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={address.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="addressLine"
              value={address.addressLine}
              onChange={handleChange}
              placeholder="House No., Street, Locality"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                  type="text"
                  name="zip"
                  value={address.zip}
                  onChange={handleChange}
                  placeholder="Enter ZIP code"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {!paymentDone ? (
          <Button variant="success" onClick={handlePayment}>
            Pay Now
          </Button>
        ) : (
          <Alert className="mt-4" variant="success">
            {message}
          </Alert>
        )}

        {message && !paymentDone && (
          <Alert className="mt-4" variant="danger">
            {message}
          </Alert>
        )}
      </Card>
    </Container>
  );
}
