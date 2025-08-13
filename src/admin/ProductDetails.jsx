import React, {useContext, useEffect, useState } from "react";
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
} from "react-bootstrap";
import { ContextCreate } from "../context/ContextCreate";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token=localStorage.getItem("accessToken")
 const {user}=useContext(ContextCreate)
  useEffect(()=>{
validateUser()
  }

  )
 const validateUser=()=>{
  if(!user){
    navigate('/login')
  }
 }
   const isRecycleBin = location.state?.isRecycleBin || false;

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found."));
  }, [id]);

  const handleEdit = () => {
    navigate('/admin/products', { state: { editProduct: product } });
  };

  const handleInactivate = async () => {
    if (!window.confirm("Are you sure you want to inactivate this product?")) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${product.id}/`, { ...product, active: false },{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      alert("Product inactivated successfully");
      setProduct({ ...product, active: false });
    } catch (err) {
      alert("Failed to inactivate product");
      console.error(err);
    }
  };

  const handleActivate = async () => {
    if (!window.confirm("Are you sure you want to activate this product?")) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${product.id}/`, { ...product, active: true },{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      alert("Product activated successfully");
      setProduct({ ...product, active: true, deleted: null });
    } catch (err) {
      alert("Failed to activate product");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? It will be moved to the recycle bin.")) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${product.id}/`, { ...product, deleted: true, active: false },{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      alert("Product moved to recycle bin");
      navigate('/admin/products');
    } catch (err) {
      alert("Failed to move product to recycle bin");
      console.error(err);
    }
  };

  const handleRestoreFromRecycleBin = async () => {
    if (!window.confirm("Are you sure you want to restore this product?")) return;
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/${product.id}/`, { ...product, deleted: false, active: true },{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      alert("Product restored successfully");
      navigate('/admin/products');
    } catch (err) {
      alert("Failed to restore product");
      console.error(err);
    }
  };

  const handleFinalDelete = async () => {if (!window.confirm("Are you sure you want to permanently remove this product from the recycle bin? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${product.id}/`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      alert("Product permanently deleted");
      navigate('/admin/products');
    } catch (err) {
      alert("Failed to permanently delete product");
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
          <p className="text-muted">Category: <Badge bg="info">{product.category}</Badge></p>
          <p>{product.description}</p>
          <h6 className="text-danger">Stock left:{product.stock}</h6>
          <h4 className="text-success">₹&nbsp;{product.price}</h4>

          {!isRecycleBin && (
            <div className="mt-3">
              <Button variant="warning" size="sm" onClick={handleEdit} className="me-2">
                Edit
              </Button>
              {product.active !== false && !product.deleted ? (
                <Button variant="danger" size="sm" onClick={handleInactivate} className="me-2">
                  Inactivate
                </Button>
              ) : (
                <Button variant="success" size="sm" onClick={handleActivate} className="me-2">
                  Activate
                </Button>
              )}
              {!product.deleted && (
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          )}

          {isRecycleBin && (
            <div className="mt-3">
              <Button variant="success" size="sm" onClick={handleRestoreFromRecycleBin} className="me-2">
                Restore
              </Button>
              <Button variant="danger" size="sm" onClick={handleFinalDelete}>
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
    </Container>
  );
}