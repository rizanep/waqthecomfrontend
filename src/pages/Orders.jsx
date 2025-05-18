import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const session = JSON.parse(localStorage.getItem("session"));


  useEffect(() => {
    
    if (!session) return;
    axios
      .get(`http://localhost:3000/orders?userId=${session.id}`)
      .then((res) => {
        setOrders(res.data);
        
      });
    axios.get("http://localhost:3000/products").then((res) => {
      setProducts(res.data);
    });
  }, [session]);

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
          const product = products.find((p) => p.id === order.productId);
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
                    <strong>Ordered on:</strong>{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </Card.Text>

                  {order.deliveryDetails && (
                    <>
                      <hr />
                      <h6 className="mb-2">Delivery Details:</h6>
                      <Card.Text className="small text-muted">
                        <strong>Name:</strong> {order.deliveryDetails.name}
                        <br />
                        <strong>Phone:</strong> {order.deliveryDetails.phone}
                        <br />
                        <strong>Address:</strong>&nbsp;
                        {order.deliveryDetails.addressLine},&nbsp;
                        {order.deliveryDetails.city} -&nbsp;
                        {order.deliveryDetails.zip}
                      </Card.Text>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
