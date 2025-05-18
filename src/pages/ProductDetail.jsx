import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found."));
  }, [id]);

  const handleAddToCart = () => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) {
      navigate("/login");
      return;
    }

    axios
      .get(
        `http://localhost:3000/cart?userId=${session.id}&productId=${product.id}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          const item = res.data[0];
          axios.patch(`http://localhost:3000/cart/${item.id}`, {
            quantity: item.quantity + 1,
          });
        } else {
          axios.post("http://localhost:3000/cart", {
            userId: session.id,
            productId: product.id,
            quantity,
          });
        }
        navigate("/cart");
      });
  };

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={product.image}
              style={{ height: "400px", objectFit: "cover" }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p className="text-muted">Category: {product.category}</p>
          <p>{product.description}</p>
          <h4 className="text-success">₹&nbsp;{product.price}</h4>
          <Form.Group controlId="quantity" className="mb-3 mt-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
