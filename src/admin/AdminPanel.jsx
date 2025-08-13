import React, { useContext, useEffect, useState } from "react";
import { Table, Tab, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ContextCreate } from "../context/ContextCreate";
import { useNavigate } from "react-router-dom";
import api from "../api";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [inactiveProducts, setInactiveProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const { user } = useContext(ContextCreate);
  const [total, setTotal] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    validateUser();
  });
  const validateUser = () => {
    if (!user) {
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const res = await api.get("order/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;

      const now = new Date();
      const lastFiveDays = [...Array(5)]
        .map((_, i) => {
          const date = new Date();
          date.setDate(now.getDate() - i);
          const key = date.toISOString().slice(0, 10);
          return { date: key, total: 0 };
        })
        .reverse();

      const salesByDate = lastFiveDays.map((day) => {
        const total = data
          .filter((order) => order.date?.startsWith(day.date))
          .reduce((sum, order) => sum + Number(order.quantity), 0);
        return { ...day, total };
      });

      setSalesData(salesByDate);
    } catch (err) {
      console.error("Failed to fetch sales data", err);
    }
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchCartItems();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get("order/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        api.get("products/"),
      ]);

      const ordersData = ordersRes.data;
      const productsData = productsRes.data;

      const quantity = ordersData.reduce((sum, order) => {
        return sum + parseInt(order.quantity, 10);
      }, 0);
      setTotal(quantity);

      const totalRevenue = ordersData.reduce((sum, order) => {
        const product = productsData.find((p) => p.id == order.product);
        const price = product?.price || 0;
        return sum + price * parseInt(order.quantity, 10);
      }, 0);
      setRevenue(totalRevenue);
    } catch (err) {
      console.error("Error fetching orders/products", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await api.get("register/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalUsers(res.data.data.length);
   
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await api.get("cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalCartItems(res.data.length);
    } catch (err) {
      console.error("Error fetching cart items", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/");
      const activeProducts = res.data.filter((p) => !p.deleted);
      setProducts(activeProducts);

      const inactive = activeProducts.filter((p) => !p.active).length;
      setInactiveProducts(inactive);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Admin Dashboard</h1>
      <div className="mb-4 p-3 bg-light border rounded">
        <h4 className="mb-3">📊 Admin Dashboard Summary</h4>
        <div className="d-flex flex-wrap gap-3">
          <div>
            <strong>Total Products:</strong> {products.length}
          </div>
          <div>
            <strong>Inactive Products:</strong> {inactiveProducts}
          </div>

          <div>
            <strong>Sold Products:</strong> {total}
          </div>
          <div>
            <strong>Total Users:</strong> {totalUsers}
          </div>
          <div>
            <strong>Total Cart Items:</strong> {totalCartItems}
          </div>
        </div>
      </div>

      <div className="mb-4 p-3 bg-light border rounded">
        <h4 className="mb-3"> Total Revenue</h4>
        <div className="d-flex flex-wrap gap-3">
          <div>
            <h1 className="ms-5">₹ {revenue.toFixed(2)}</h1>
          </div>
        </div>
      </div>
      <Row className="mb-4">
        <Col md={6}>
          <h5>Product Sales (Bar Chart)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Col>

        <Col md={6}>
          <h5>Product Sales (Pie Chart)</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesData}
                dataKey="total"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {salesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
