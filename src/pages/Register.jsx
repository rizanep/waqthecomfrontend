import axios from "axios";
import React, { useState,useEffect, useRef } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [phn, setPhn] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
const userInputRef   = useRef(null);
 useEffect(() => {
    window.scrollTo(0, 0);
    userInputRef.current?.focus(); 
  }, []);
  const handleSumbit = async (e) => {
    e.preventDefault();
    const user = {
      name,
      phn,
      userName,
      password,
    };
    try {
      const res = await axios.get(
        `http://localhost:3000/users?userName=${userName}`
      );

      if (res.data.length > 0) {
        alert("Username already Exists");
        return;
      } else {
        axios.post("http://localhost:3000/users", user);
        alert("Registration Successful");
      }
    } catch (err) {
      console.error("Error saving user", err);
    }

    navigate("/login");
  };

  return (
    <div
      className=" d-flex justify-content-center align-items-center "
      style={{ minHeight: "100vh" }}
    >
      <Container className=" d-flex justify-content-center">
        <Card
          style={{ width: "100%", maxWidth: "400px" }}
          className="p-4 shadow"
        >
          <h2 className="text-center mb-4">Register Here</h2>
          <Form onSubmit={handleSumbit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
              ref={userInputRef}
                type="text"
                placeholder="Enter your Full name Here"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]{10}"
                placeholder="Enter your phone number here"
                required
                value={phn}
                onChange={(e) => setPhn(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter a new username here"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="enter your password here"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
          <Link to="/login" className=" text-md-end mt-2">
            Allready registered? Click here
          </Link>
        </Card>
      </Container>
    </div>
  );
}

export default Register;
