import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import { ContextCreate } from "../context/ContextCreate";
import api from "../api";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const { user } = useContext(ContextCreate);
  const isRecycleBin = location.state?.isRecycleBin || false;

  // User validation
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch product
  useEffect(() => {
    window.scrollTo(0, 0);
    api
      .get(`products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found."));
  }, [id]);

  // Modal handlers
  const handleActionClick = (actionType) => {
    setModalAction(actionType);
    setModalShow(true);
  };

  const handleConfirm = async () => {
    setModalShow(false);
    if (!product) return;

    try {
      switch (modalAction) {
        case "inactivate":
          await api.put(
            `products/${product.id}/`,
            { ...product, active: false },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Product inactivated successfully");
          setProduct({ ...product, active: false });
          break;

        case "activate":
          await api.put(
            `products/${product.id}/`,
            { ...product, active: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Product activated successfully");
          setProduct({ ...product, active: true, deleted: null });
          break;

        case "delete":
          await api.put(
            `products/${product.id}/`,
            { ...product, deleted: true, active: false },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Product moved to recycle bin");
          navigate("/admin/products");
          break;

        case "restore":
          await api.put(
            `products/${product.id}/`,
            { ...product, deleted: false, active: true },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Product restored successfully");
          navigate("/admin/products");
          break;

        case "finalDelete":
          await api.delete(`products/${product.id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Product permanently deleted");
          navigate("/admin/products");
          break;

        default:
          break;
      }
    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    }
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
              style={{ height: "500px", objectFit: "cover" }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p className="text-muted">
            Category: <Badge bg="info">{product.category}</Badge>
          </p>
          <p>{product.description}</p>
          <h6 className="text-danger">Stock left: {product.stock}</h6>
          <h4 className="text-success">₹ {product.price}</h4>

          {!isRecycleBin && (
            <div className="mt-3">
              <Button
                variant="warning"
                size="sm"
                onClick={() =>
                  navigate("/admin/products", { state: { editProduct: product } })
                }
                className="me-2"
              >
                Edit
              </Button>
              {product.active !== false && !product.deleted ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleActionClick("inactivate")}
                  className="me-2"
                >
                  Inactivate
                </Button>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleActionClick("activate")}
                  className="me-2"
                >
                  Activate
                </Button>
              )}
              {!product.deleted && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleActionClick("delete")}
                >
                  Delete
                </Button>
              )}
            </div>
          )}

          {isRecycleBin && (
            <div className="mt-3">
              <Button
                variant="success"
                size="sm"
                onClick={() => handleActionClick("restore")}
                className="me-2"
              >
                Restore
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleActionClick("finalDelete")}
              >
                Permanently Delete
              </Button>
            </div>
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Link to="/admin/products">Back to Product List</Link>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalAction === "inactivate" &&
            "Are you sure you want to inactivate this product?"}
          {modalAction === "activate" &&
            "Are you sure you want to activate this product?"}
          {modalAction === "delete" &&
            "Are you sure you want to move this product to the recycle bin?"}
          {modalAction === "restore" &&
            "Are you sure you want to restore this product?"}
          {modalAction === "finalDelete" &&
            "Are you sure you want to permanently delete this product? This action cannot be undone."}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
