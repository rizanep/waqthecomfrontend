import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import { useLoading } from "../context/LoadingContext";
import api from "../api";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const session = JSON.parse(localStorage.getItem("session"));
  const { setLoading } = useLoading();

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!session) return;

  setLoading(true);

  const productsRequest = api.get("products/");

  const ordersRequest = api.get(
    `order/?user=${session.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  Promise.all([productsRequest, ordersRequest])
    .then(([productsRes, ordersRes]) => {
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    })
    .catch((err) => {
      const errMsg =
        err.response?.data?.detail ||
        err.response?.data ||
        "Failed to fetch data.";
      setError(errMsg);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);


  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!orders.length) {
    return (
      <Container className="mt-5">
        <Alert variant="info">You have no orders yet.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Orders</h2>
      <Row>
        {orders.map((order) => {
          const product = products.find((p) => p.id === order.product);
          if (!product) return null;
          return (
            <Col md={6} lg={4} key={order.id} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <strong>Quantity:</strong> {order.quantity}
                    <br />
                    <strong>Total Price:</strong> ₹
                    {(product.price * order.quantity).toFixed(2)}
                    <br />
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        order.status === "pending"
                          ? "bg-warning text-dark"
                          : order.status === "shipped"
                          ? "bg-primary"
                          : order.status === "delivered"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {order.status}
                    </span>
                    <br />
                    <strong>Ordered on:</strong>{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </Card.Text>

                  <>
                    <hr />
                    <h6 className="mb-2">Delivery Details:</h6>
                    <Card.Text className="small text-muted">
                      <strong>Name:</strong> {order.name}
                      <br />
                      <strong>Phone:</strong> {order.phone}
                      <br />
                      <strong>Address:</strong> {order.address_line},{" "}
                      {order.city} - {order.zip_code}
                    </Card.Text>
                  </>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
