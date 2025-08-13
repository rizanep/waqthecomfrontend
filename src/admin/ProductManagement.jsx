import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Modal, Form, Table, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ContextCreate } from "../context/ContextCreate";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category:'',
    image: "",
    active: true,
  });
  const [imageInputType, setImageInputType] = useState("url");
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [recycleBinItems, setRecycleBinItems] = useState([]);
  const token=localStorage.getItem("accessToken")

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const navigate = useNavigate();
  const location = useLocation();
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
    fetchProducts();
    fetchCategories();
    fetchRecycleBinItems();
    
  }, []);

  useEffect(() => {
    if (location.state?.editProduct) {
      const productToEdit = location.state.editProduct;
      setFormData({ ...productToEdit });

      setIsEdit(true);
      setShowModal(true);
      navigate("/admin/products");
    }
  }, [location, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to fetch products");
      console.error(err);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/catogories/");
      setCategories(["All", ...res.data.map((cat) => cat.name)]);
    } catch (err) {
      alert("Failed to fetch categories");
      console.error(err);
    }
  };

  const fetchRecycleBinItems = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/products/");
      setRecycleBinItems(res.data.filter((p) => p.deleted));
    } catch (err) {
      alert("Failed to fetch recycle bin items");
      console.error(err);
    }
  };

  const filteredProducts = products.filter(
    (p) => filteredCategory === "All" || p.category === filteredCategory
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (direction) => {
    window.scrollTo(0, 0);

    if (direction === "prev") {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next") {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((fd) => ({ ...fd, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: "",
      active: true,
    });
    setImageInputType("url");
    setIsEdit(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.stock ||

      !formData.category.trim() ||
      !formData.image.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    // const duplicate = products.find(
    //   (p) => p.name.toLowerCase() === formData.name.trim().toLowerCase()
    // );
    // if (duplicate) {
    //   alert("Product with this name already exists!");
    //   return;
    // }

    try {
      if (isEdit) {
        await axios.put(
          `http://127.0.0.1:8000/api/products/${formData.id}/`,
          formData,{headers: {
    Authorization: `Bearer ${token}`,
  },
      }
        );
        alert("Product updated successfully");
      } else {
        const maxId = products.reduce(
          (max, p) => (parseInt(p.id) > max ? parseInt(p.id) : max),
          0
        );
        const newProduct = { ...formData, id: (maxId + 1).toString() };
        await axios.post("http://127.0.0.1:8000/api/products/", newProduct,{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
        alert("Product added successfully");
      }

      fetchProducts();
      setShowModal(false);
    } catch (err) {
      alert("Failed to save product");
      console.error(err);
    }
  };

  return (
    <>
      <Row className="mb-3 align-items-center gap-2">
        <Col md={3}>
          <h3>Product Management</h3>
        </Col>
        <Col md={4}>
           
        </Col>
        <Col md={4} className="text-end ">
          <Button onClick={openAddModal} className="me-1 me-md-0">
            Add New Product
          </Button>
          <Button
            variant="outline-danger"
            className="ms-2 mt-md-2 mt-lg-0"
            onClick={() => setShowRecycleBin(!showRecycleBin)}
          >
            {showRecycleBin ? "Hide Recycle Bin" : "Recycle Bin"}
          </Button>
        </Col>
      </Row>

      {!showRecycleBin && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Name</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No products found
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={!product.active ? "table-warning" : "null"}
                  >
                    <td>{indexOfFirstProduct + index + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: "50px",
                          height: "50PX",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="me-2"
                      >
                        <Button variant="info" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="text-center mb-3">
              <Button
                variant="secondary"
                onClick={() => paginate("prev")}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => paginate("next")}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {showRecycleBin && (
        <div>
          <h3>Recycle Bin</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recycleBinItems.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No items in the recycle bin
                  </td>
                </tr>
              ) : (
                recycleBinItems.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      <Link
                        to={`/admin/products/${product.id}`}
                        state={{ isRecycleBin: true }}
                        className="me-2"
                      >
                        <Button variant="info" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEdit ? "Edit Product" : "Add New Product"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                required
              >
                <option value="">Select a category</option>
                
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="stock"
                value={formData.stock}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Image Type</Form.Label>
              <Form.Check
                inline
                label="URL"
                type="radio"
                name="imageInputType"
                checked={imageInputType === "url"}
                onChange={() => setImageInputType("url")}
              />
              <Form.Check
                inline
                label="Upload"
                type="radio"
                name="imageInputType"
                checked={imageInputType === "upload"}
                onChange={() => setImageInputType("upload")}
              />
            </Form.Group>
            {imageInputType === "url" && (
              <Form.Group className="mb-2">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  required
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </Form.Group>
            )}
            {imageInputType === "upload" && (
              <Form.Group className="mb-2">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  required={!formData.image}
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? "Update Product" : "Add Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProductManagement;
