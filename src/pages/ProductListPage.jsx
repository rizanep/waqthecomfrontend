import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Button, Row, Col, Form } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { ContextCreate } from "../context/ContextCreate";
import "../Home.css";
import { FaWhatsapp } from "react-icons/fa";
import { useLoading } from "../context/LoadingContext";
import api from "../api";
const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [categories,setCategories]=useState([])
  const navigate = useNavigate();
  const { user, wishlist, setWishlist } = useContext(ContextCreate);
  const token=localStorage.getItem("accessToken")
  const { setLoading } = useLoading();

const handleShare = (product) => {
  const productURL = `https://spectacular-stroopwafel-c4c611.netlify.app/product/${product.id}`;
  const message = `Check out this product: ${product.name} - ₹${product.price}. View it here: ${productURL}`;
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};

  const fetchCategories = async () => {
    try {
      const res = await api.get("catogories/");
      setCategories(["All", ...res.data.map((cat) => cat.name)]);
    } catch (err) {
      alert("Failed to fetch categories");
      console.error(err);
    }
  };
  useEffect(() => {
    setLoading(true);
    api.get("products/").then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
      setLoading(false);
    fetchCategories()
    });

    if (user) {
      api
        .get(`wishlist/?userId=${user.id}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      })
        .then((res) => setWishlist(res.data));
    }
  }, [user, setWishlist]);

  useEffect(() => {
    let result = [...products];
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (sort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFiltered(result);
  }, [search, category, sort, products]);

 const toggleWishlisticon = async (product) => {
    const exists = wishlist.find((item) => item.productId === product.id);
    let deleteid;
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      await api.get(`wishlist/?userId=${user.id}&productId=${product.id}`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      })
      .then((res)=>{
        deleteid=res.data[0].id
      })
      await api.delete(`wishlist/${deleteid}/`,{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
    } else {
      const newItem = { productId: product.id, userId: user.id };
      setWishlist((prev) => [...prev, newItem]);
      await api.post("wishlist/", newItem,{headers: {
    Authorization: `Bearer ${token}`,
  },
      });
    }
  };

  return (
    <div className="container ">
      <div className="banner-container mb-5 mt-0">
        <img
          src="https://cdn.shopify.com/s/files/1/0261/8900/4880/files/alba-2.jpg?v=1688536828"
          alt="Product Banner"
          className="banner-image"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      </div>

      <h1 className="mb-4 text-center">All Products</h1>
      <Row className="mb-4 ">
        <div className="d-flex gap-2 flex-md-row flex-lg-row flex-column">
        <Col md={3} className=" gap-2">
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            
                
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
          </Form.Select>
        </Col>
        <Col md={3} >
          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        </div>
      </Row>

      <Row>
  {filtered.map((product) => {
    const isWishlisted = wishlist.some((item) => item.productId === product.id);
    return (
      <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
        <div className="product-card border rounded shadow-sm p-2 position-relative h-100">
          
          {/* Wishlist Icon - Top Right */}
          <div
            className="wishlist-icon position-absolute top-0 end-0 p-2"
            onClick={() => toggleWishlisticon(product)}
            style={{ cursor: "pointer", zIndex: 2 }}
          >
            {user &&
              (isWishlisted ? (
                <FaHeart color="red" size={20} />
              ) : (
                <FaRegHeart size={20} />
              ))}
          </div>

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: "100%", height: "220px", objectFit: "cover" }}
          />

          {/* Product Info */}
          <h5 className="mt-2 mb-1">{product.name}</h5>
          <p className="text-muted">₹{product.price}</p>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            View Details
          </Button>

          {/* Share Icon - Bottom Right */}
          <div
            className="share-icon position-absolute top-0 start-0 p-2"
            onClick={() => handleShare(product)}
            style={{ cursor: "pointer", zIndex: 2 }}
          >
            <FaWhatsapp size={25} color="black" />
          </div>
        </div>
      </Col>
    );
  })}
</Row>

    </div>
  );
};

export default ProductListPage;
