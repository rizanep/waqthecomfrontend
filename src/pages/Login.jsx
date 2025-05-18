import axios from "axios";
import React, { useContext, useState, useRef, useEffect } from "react";
import { Button, Card, Container, Form, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ContextCreate } from "../context/ContextCreate";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(ContextCreate);

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

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(
        `http://localhost:3000/users?userName=${userName}&password=${password}`
      );
      if (res.data.length > 0) {
        const userData = res.data[0];
        localStorage.setItem("session", JSON.stringify(userData));
        setUser(userData);

        showToastMsg("Login successful", "success");
        setTimeout(() => navigate("/"), 1000);
      } else {
        showToastMsg("Invalid Username or Password", "danger");
      }
    } catch (err) {
      console.error("Login error", err);
      showToastMsg("Error during login. Try again.", "danger");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Container className="d-flex justify-content-center">
        <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4 shadow">
          <h2 className="text-center mb-4">Log In</h2>
          <Form onSubmit={handleSumbit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                ref={userInputRef}
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="outline-primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register">Don't have an account? Register here</Link>
          </div>
        </Card>
      </Container>

      {/* Toast Notification */}
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

export default Login;
