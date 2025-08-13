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
import { useLoading } from "../context/LoadingContext";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token=localStorage.getItem("accessToken")
  const { setLoading } = useLoading();
 useEffect(() => {
  window.scrollTo(0, 0);
  setLoading(true);

  axios
    .get(`http://127.0.0.1:8000/api/products/${id}/`)
    .then((res) => {
      setProduct(res.data);
    })
    .catch(() => {
      setError("Product not found.");
    })
    .finally(() => {
      setLoading(false);
    });
}, [id]);
  const handleAddToCart = () => {
    const session = JSON.parse(localStorage.getItem("session"));
    if (!session) {
      navigate("/login");
      return;
    }

    axios
      .get(
        `http://127.0.0.1:8000/api/cart/?userId=${session.id}&productId=${product.id}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      }
      )
      .then((res) => {
        if (res.data.length > 1000) {
          const item = res.data[0];
          axios.patch(`http://127.0.0.1:8000/api/cart/${item.id}/`, {
            quantity: item.quantity + 1,
          },{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
        } else {
          axios.post("http://127.0.0.1:8000/api/cart/", {
            userId: session.id,
            productId: product.id,
            quantity,
          },{headers: {
    Authorization: `Bearer ${token}`,
  },
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

      {product.stock === 0 ? (
        <p className="text-danger fw-bold">Out of Stock</p>
      ) : product.stock < 10 ? (
        <p className="text-warning fw-semibold">Only {product.stock} left in stock!</p>
      ) : (
        <p className="text-success">In Stock.</p>
      )}

      <Form.Group controlId="quantity" className="mb-3 mt-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          value={quantity}
          min={1}
          max={product.stock} // Prevent ordering more than available
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          disabled={product.stock === 0} // Disable if out of stock
        />
      </Form.Group>

      <Button
        variant="primary"
        onClick={handleAddToCart}
        disabled={product.stock === 0} 
      >
        Add to Cart
      </Button>
    </Col>
  </Row>
</Container>

  );
}
