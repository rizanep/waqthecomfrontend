import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import api from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    passwordInputRef.current?.focus();
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
      const res = await api.post("reset-password/", { token, password });
      showToastMsg(res.data.message, "success");
      setTimeout(() => navigate("/login"), 1500);
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
          <h2>Reset Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                ref={passwordInputRef}
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Reset Password
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
