import React, { useContext,useState, useEffect, useRef } from "react";
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
import { ContextCreate } from "../context/ContextCreate";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");
  const [showToast, setShowToast] = useState(false);
   const { setUser } = useContext(ContextCreate);

  const navigate = useNavigate();
  const userInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    userInputRef.current?.focus();
  }, []);

  const showToastMsg = (message, variant = "danger") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
const handleSumbit = async (e) => {
  e.preventDefault();

  try {
  const res = await axios.post("http://127.0.0.1:8000/api/login/", {
    username: userName,
    password: password,
  });

  const user = res.data.user;

  if (!user) {
    showToastMsg("Invalid response from server", "danger");
    return;
  }

  if (user.blocked) {
    showToastMsg("Your account is blocked. Contact admin.", "danger");
    return;
  }

  if (!user.active) {
    showToastMsg("Your account is inactive.", "danger");
    return;
  }

  localStorage.setItem("accessToken", res.data.access);
  localStorage.setItem("refreshToken", res.data.refresh);
  localStorage.setItem("session", JSON.stringify(user));
  setUser(user);

  showToastMsg("Login successful", "success");

  setTimeout(() => {
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }, 1000);
  setUser(user)
} catch (err) {
  console.error("Login error", err);
  const msg = err.response?.data?.detail || "Login failed. Try again.";
  showToastMsg(msg, "danger");
}
};


  return (
    <div className="register-page" style={{ flexDirection: "row-reverse", transition: "all 0.5s ease-in-out" }}>
      <div className="register-form-section">
        <Card className="register-card">
          <h2>Login to your account</h2>
          <Form onSubmit={handleSumbit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                ref={userInputRef}
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <Link to="/register">Don't have an account? Register</Link>
          <Link to="/forgot-password" className="mt-2 d-block">
  Forgot Password?
</Link>
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

export default Login;