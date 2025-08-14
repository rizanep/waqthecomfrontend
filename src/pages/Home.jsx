import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Carousel,
} from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ContextCreate } from "../context/ContextCreate";
import "../Home.css";
import "./Newdesign.css";
import useNotificationSocket from "../hooks/useNotificationSocket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [p, setP] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { user, wishlist, setWishlist, config } = useContext(ContextCreate);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get("products/").then((res) => {
      setProducts(res.data);
      api
        .get("products/")
        .then((res) => {
          setP(res.data);
        });
    });

    if (user) {
      api
        .get(`wishlist/?userId=${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setWishlist(res.data));
    }
  }, [user, setWishlist, setP]);
  const handleShare = (product) => {
  const productURL = `https://spectacular-stroopwafel-c4c611.netlify.app/product/${product.id}`;
  const message = `Check out this product: ${product.name} - ₹${product.price}. View it here: ${productURL}`;
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");
};
   
  const toggleWishlisticon = async (product) => {
    const exists = wishlist.find((item) => item.productId === product.id);
    let deleteid;
    if (exists) {
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== product.id)
      );
      await api
        .get(
          `wishlist/?userId=${user.id}&productId=${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          deleteid = res.data[0].id;
        });
      await api.delete(`wishlist/${deleteid}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      const newItem = { productId: product.id, userId: user.id };
      setWishlist((prev) => [...prev, newItem]);
      await api.post("wishlist/", newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };

  return (
    <Container className="p-0 m-0">
      <Carousel fade className="carso">
        <Carousel.Item interval={5000}>
          <img
            className="d-block w-100"
            src="https://zimsonwatches.com/cdn/shop/files/brand-centre-banner-generator-new-watches-2025-m127334-0001_2000x920_en.jpg?v=1743498470&width=2000"
            alt="First slide"
            style={{ objectFit: "cover", height: "450px" }}
          />
        </Carousel.Item>

        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://zimsonwatches.com/cdn/shop/files/2_67eb14e2-6629-44ed-8eeb-3e212fa2c252.png?v=1720002127&width=2000"
            alt="Second slide"
            style={{ objectFit: "cover", height: "450px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://zimsonwatches.com/cdn/shop/files/2000x886-rado.webp?v=1709722587&width=2000"
            alt="Third slide"
            style={{ objectFit: "cover", height: "450px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://zimsonwatches.com/cdn/shop/files/Untitled_design_-_2025-02-20T130127.750.png?v=1740036873&width=2000"
            alt="Third slide"
            style={{ objectFit: "cover", height: "450px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://zimsonwatches.com/cdn/shop/files/4_d1849474-75ec-4208-9c74-79c58758524d.png?v=1720002252&width=2000"
            alt="Third slide"
            style={{ objectFit: "cover", height: "450px" }}
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://zimsonwatches.com/cdn/shop/files/TTCS_-_Product_-_Visual_7.png?v=1720093674&width=2000"
            alt="Third slide"
            style={{ objectFit: "cover", height: "450px" }}
          />
        </Carousel.Item>
      </Carousel>
      {/* <ToastContainer /> */}
      <div className="running-text-container">
        <div className="running-text">
          <span>BOOK YOUR WATCH FOR SERVICE</span>
          <span>-</span>
          <span>FREE DELIVERY</span>
          <span>-</span>
          <span>SHOP TISSOT WATCHES</span>
          <span>-</span>
          <span>BOOK YOUR WATCH FOR SERVICE</span>
          <span>-</span>
          <span>FREE DELIVERY</span>
          <span>-</span>
          <span>BOOK YOUR WATCH FOR SERVICE</span>
          <span>-</span>
          <span>FREE DELIVERY</span>
          <span>-</span>
          <span>SHOP TISSOT WATCHES</span>
          <span>-</span>
          <span>BOOK YOUR WATCH FOR SERVICE</span>
          <span>-</span>
          <span>FREE DELIVERY</span>
          <span>-</span>
        </div>
      </div>
      <div className=" px-3 my-5">
        <h3 className="text-center mb-5 fw-bold mt-5">Our Top Brands</h3>
        <div className="d-flex flex-wrap justify-content-center gap-5 mt-5">
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/tissot_b0d6385e-e035-4c98-8798-ee7a482ac07e.png?v=1682609938&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-white fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Tissot
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/casio_3b22e7d1-0b13-4138-addf-4f9a7c98df0b.png?v=1682609937&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-black fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Casio
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/timex.png?v=1682609929&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-black fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Timex
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/MICHAEL_KORS.png?v=1682609937&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-b fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Michael Kors
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/TITEN.png?v=1682609935&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-white fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Titan
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/fossil_f893499c-bd2d-40cf-8dc0-cfec028b4a5d.png?v=1682609938&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-white fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Fossil
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/balman.png?v=1682609939&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-white fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "0px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Balmain
              </p>
            </div>
          </div>
          <div className="brand-box border rounded-4 shadow-lg bg-white">
            <div style={{ position: "relative" }}>
              <img
                src={`https://zimsonwatches.com/cdn/shop/files/seiko_963fd0a0-1356-445a-9eb4-8a52775e9790.png?v=1682610510&width=535`}
                alt={`Brand`}
                className="rounded-4"
                style={{ height: "350px", objectFit: "contain", width: "100%" }}
                onClick={() => navigate(`/productlist`)}
              />
              <p
                className="text-white fw-bold"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10px",

                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: 0,
                }}
              >
                Seiko
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-5" />
      <div className="feature-container">
        <div className="feature-text left">
          <div className="point">
            <span className="point-number">01.</span>
            <h4>Full HD AMOLED</h4>
            <p>
              Enjoy crisp visuals with a vibrant AMOLED 1.75" display perfect
              for outdoor and indoor use.
            </p>
          </div>
          <div className="point">
            <span className="point-number">02.</span>
            <h4>Ultra Battery Backup</h4>
            <p>
              Runs up to 7 days on a single charge with smart battery
              optimization.
            </p>
          </div>
        </div>

        <div className="image-area">
          <div className="circle-border"></div>
          <div className="product-img-wrapper">
            <img
              src="src/assets/watch.png"
              alt="Smartwatch"
              className="product-img"
            />
          </div>
        </div>

        <div className="feature-text right">
          <div className="point">
            <span className="point-number">03.</span>
            <h4>Health Monitoring</h4>
            <p>
              Includes heart rate, SpO2, and sleep tracking with 24x7
              monitoring.
            </p>
          </div>
          <div className="point">
            <span className="point-number">04.</span>
            <h4>Smart Notifications</h4>
            <p>
              Stay connected with alerts for calls, texts, and apps directly on
              your wrist.
            </p>
          </div>
        </div>
      </div>
      <hr className="my-5" />
      <h3 className="text-center mb-5 fw-bold ">EXPLORE THE COLLECTION</h3>

      <Row>
        {p.slice(0,4).map((product) => {
          const isWishlisted = wishlist.some(
            (item) => item.productId === product.id
          );

          return (
            <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
              <div className="product-card border rounded shadow-sm p-2 position-relative h-100">
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
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "220px", objectFit: "cover" }}
                />
                <h5 className="mt-2 mb-1">{product.name}</h5>
                <p className="text-muted">₹&nbsp;{product.price}</p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </Button>
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
      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="outline-primary"
          size="md"
          onClick={() => navigate(`/productlist`)}
          style={{
            borderRadius: "25px",
            padding: "10px 20px",
            fontWeight: "700",
          }}
        >
          View More Products
        </Button>
      </div>
    </Container>
  );
}
