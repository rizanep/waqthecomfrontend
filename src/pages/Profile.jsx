import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Tab,
  Tabs,
  Form,
  Button,
  Table,
  Alert,
} from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
export default function Profile() {
  const session = JSON.parse(localStorage.getItem("session"));
  const token = localStorage.getItem("accessToken");
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/register/${session.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data.data);
    } catch (error) {
      console.error("User data error", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const pr = await axios.get(`http://127.0.0.1:8000/api/products/`);
      setProducts(pr.data);
      const res = await axios.get(
        `http://127.0.0.1:8000/api/order?user=${session.id}`
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Order fetch error", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/register/${session.id}/`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update error", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2>My Profile</h2>
      {message && <Alert variant="success">{message}</Alert>}
      <Tabs defaultActiveKey="profile" className="mb-3">
        <Tab eventKey="profile" title="Profile Info">
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={userData.name || ""}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userData.email || ""}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={userData.phn || ""}
                onChange={(e) =>
                  setUserData({ ...userData, phn: e.target.value })
                }
              />
            </Form.Group>

            {/* Add more fields if needed like address, etc. */}

            <Button className="mt-3" onClick={handleUpdate}>
              Update Profile
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="orders" title="My Orders">
          <Table striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{products.find((a) => a.id == order.product).name}</td>
                  <td>{order.status}</td>
                  <td>
                    {new Date(order.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="payments" title="Payments">
          <Table striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Reciept</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    ₹
                    {products.find((a) => a.id == p.product).price * p.quantity}
                  </td>

                  <td>
                    {new Date(p.date).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>
                    <Button variant="outline-primary">
                      <FaDownload />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
}
