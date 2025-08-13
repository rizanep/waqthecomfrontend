import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Alert,
  Form,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ContextCreate } from "../context/ContextCreate";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    zip: "",
  });
  const token =localStorage.getItem("accessToken")
  const navigate = useNavigate();
  const session = JSON.parse(localStorage.getItem("session"));
  const { totalamount, setCartCount } = useContext(ContextCreate);

  // Fetch cart and products
  useEffect(() => {
    const fetchData = async () => {
      if (!session) return navigate("/login");

      try {
        const [cartRes, productRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/cart?userId=${session.id}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      }),
          axios.get("http://127.0.0.1:8000/api/products"),
        ]);

        const cartData = cartRes.data;
        const productData = productRes.data;

        setCart(cartData);
        setProducts(productData);

        // Build current cart with product info
        const mergedCart = cartData.map((item) => {
          const product = productData.find((p) => p.id === item.productId);
          return {
            ...item,
            productName: product?.name,
            price: product?.price,
          };
        });

        setCurrentCartItems(mergedCart);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [ ]);

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
  try {
    await axios.post("http://127.0.0.1:8000/api/order/", {
      user: session.id,
      product: item.productId,
      quantity: item.quantity,
      date: new Date().toISOString(),
      name: address.name,
      phone: address.phone,
      address_line: address.addressLine,
      city: address.city,
      zip_code: address.zip
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await axios.delete(`http://127.0.0.1:8000/api/cart/${item.id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

  } catch (error) {
    console.error("Error while creating order or deleting cart:", error);
  }
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
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
const initiatePayment = async () => {
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

  const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  try {
    const orderRes = await axios.post(
      "http://127.0.0.1:8000/api/create-order/",
      { amount: totalamount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { order_id, amount, currency, razorpay_key } = orderRes.data;

    const options = {
      key: razorpay_key,
      amount: amount,
      currency: currency,
      name: "WaQTH eStore",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
  try {
    const verifyRes = await axios.post(
      "http://127.0.0.1:8000/api/verify-payment/",
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Verification response:", verifyRes.data);

    if (verifyRes.data.message === "Payment Verified Successfully") {
      handlePayment();
    } else {
      setMessage("Payment verification failed.");
    }
  } catch (err) {
    console.error("Verification error:", err);
    setMessage("Verification error: " + err.message);
  }
},
      prefill: {
        name: address.name,
        contact: address.phone,
      },
      notes: {
        address: `${address.addressLine}, ${address.city}, ${address.zip}`,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error("Order creation error:", err);
    setMessage("Could not initiate payment. Try again.");
  }
};

  return (
    <Container className="py-5">
      <Card className="p-4">
        <h3 className="mb-4">Place Your Order</h3>

        <ListGroup className="mb-4">
          {currentCartItems.map((item) => (
            <ListGroup.Item
              key={item.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item.productName}</strong> <br />
                ₹{item.price} x {item.quantity}
              </div>
              <div>₹{item.price * item.quantity}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <p>
          <strong>Total Amount: ₹ {totalamount}</strong>
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
          <Button variant="success" onClick={initiatePayment}>
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
