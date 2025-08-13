import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Carousel,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css";
import api from "../api";

function Register() {
  const [name, setName] = useState("");
  const [phn, setPhn] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const userInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    userInputRef.current?.focus();
  }, []);

  const showToastMsg = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!phn.match(/^\d{10}$/)) newErrors.phn = "Phone must be 10 digits";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!userName.trim()) newErrors.userName = "Username is required";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== password2)
      newErrors.password2 = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = {
      name,
      phn,
      username: userName,
      password,
      password2,
      email,
      blocked: false,
      active: true,
      role: "user",
    };

    try {
      await api.post("register/", user);
      showToastMsg("Registration Successful", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData && typeof responseData === "object") {
        // Collect all error messages from backend
        const backendErrors = Object.entries(responseData)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join(" | ");

        showToastMsg(backendErrors, "danger");
      } else {
        showToastMsg("Registration failed", "danger");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-section">
        <Card className="register-card">
          <h2>Create an account</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                ref={userInputRef}
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={phn}
                onChange={(e) => setPhn(e.target.value)}
                isInvalid={!!errors.phn}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phn}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Id</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                isInvalid={!!errors.userName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.userName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                isInvalid={!!errors.password2}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password2}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-2">
              Create account
            </Button>
          </Form>
          <Link to="/login">Already have an account? Log in</Link>
        </Card>
      </div>

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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
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

export default Register;
