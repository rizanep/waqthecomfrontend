import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Toast,
  ToastContainer,
  Card,
  Carousel,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");
  const [showToast, setShowToast] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    emailInputRef.current?.focus();
  }, []);

  const showToastMsg = (message, variant = "danger") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/forgot-password/", { email });
      showToastMsg(res.data.message, "success");
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      showToastMsg(msg, "danger");
    }
  };

  return (
    <div className="register-page">
      {/* Left Side Form */}
      <div className="register-form-section">
        <Card className="register-card">
          <h2>Forgot Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                ref={emailInputRef}
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Reset Link
            </Button>
          </Form>
        </Card>
      </div>

      {/* Right Side Carousel */}
      <div className="register-carousel d-none d-md-block">
        <Carousel fade controls={false} indicators={true} interval={3000}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://zimsonwatches.com/cdn/shop/files/4_d1849474-75ec-4208-9c74-79c58758524d.png?v=1720002252&width=2000"
              alt="Slide 1"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast bg={toastVariant} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
