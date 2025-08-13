import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Form, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { ContextCreate } from "../context/ContextCreate";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token=localStorage.getItem("accessToken")
  const { user } = useContext(ContextCreate);
  useEffect(() => {
    validateUser();
  });
  const validateUser = () => {
    if (!user) {
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchOrdersWithDetails();
  }, []);
const handleStatusChange = async (orderId, newStatus) => {
  try {
    await api.patch(`order/${orderId}/`, {
      status: newStatus,
    });
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  } catch (error) {
    console.error("Failed to update status:", error);
  }
};
  const fetchOrdersWithDetails = async () => {
    try {
      const ordersResponse = await api.get("order/",{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setOrders(ordersResponse.data);

      const productsResponse = await api.get(
        "products/"
      );
      setProducts(productsResponse.data);

      const userIds = [
        ...new Set(ordersResponse.data.map((order) => order.user)),
      ];

      const usersData = {};
      for (const userId of userIds) {
        try {
          const userResponse = await api.get(
            `register/${userId}`
          ,{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
          usersData[userId] = userResponse.data.data;

        } catch (userError) {
          console.error(`Error fetching user ${userId}:`, userError);
          usersData[userId] = { name: "User Not Found" };
        }
      }
      setUsers(usersData);
    } catch (err) {
      setError("Failed to fetch orders.");
      console.error("Error fetching orders:", err);
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!orders.length) {
    return (
      <Container className="mt-5">
        <Alert variant="info">No orders found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-5">
        <Col>
          <h2 className="mb-0">All Orders</h2>
        </Col>
        <Col md="4" className="text-end">
          <Form.Control
            type="text"
            placeholder="Search by Order ID or Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        {orders
          .filter((order) => {
            const product = products.find((p) => p.id === order.product);
            const orderIdMatch = order.id
            
              .toString()
              .includes(search.toLowerCase());
            const productNameMatch = product?.name
              .toLowerCase()
              .includes(search.toLowerCase());  
            return orderIdMatch || productNameMatch;
          })
          .map((order) => {
            const product = products.find((p) => p.id === order.product);
            const user = users[order.user];

            if (!product) return null;

            return (
              <Col md={6} lg={4} key={order.id} className="mb-4">
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    style={{ height: "300px", objectFit: "contain" }}
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Ordered by:&nbsp;
                      {user ? `${user.name}` : `User ID: ${order.user}`}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Quantity:</strong> {order.quantity}
                      <br />
                      <strong>Total Price:</strong> ₹&nbsp;
                      {(product.price * order.quantity).toFixed(2)}
                      <br />
                      <strong>Ordered on:</strong>&nbsp;
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
                          <strong>Address:</strong>&nbsp;
                          {order.address_line},&nbsp;
                          {order.city} -&nbsp;
                          {order.zip_code}
                        </Card.Text>
                      </>
                    
                    <hr />
                    <Card.Text className="text-end">
                      <strong>Order ID:</strong> {order.id}
                    </Card.Text>
                    <Form.Group controlId={`orderStatus-${order.id}`} className="mt-3">
  <Form.Label><strong>Status:</strong></Form.Label>
  <Form.Select
    value={order.status}
    onChange={(e) => handleStatusChange(order.id, e.target.value)}
  >
    
    <option value="placed">Placed</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
    <option value="cancelled">Cancelled</option>
  </Form.Select>
</Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default ViewOrders;
