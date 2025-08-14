import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Alert, Modal } from "react-bootstrap";
import { ContextCreate } from "../context/ContextCreate";
import { useNavigate } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap";
import api from "../api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { user } = useContext(ContextCreate);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: "",
    userId: null,
  });

  useEffect(() => {
    validateUser();
  });
  const validateUser = () => {
    if (!user) {
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [setUsers]);
  const openConfirmModal = (action, userId) => {
    setConfirmModal({ show: true, action, userId });
  };
  const fetchUsers = async () => {
    try {
      const response = await api.get("register/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data.filter((p)=>p.role=="user"));
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userResponse = await api.get(
        `register/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const ordersResponse = await api.get(
        `order?user=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cartResponse = await api.get(
        `cart?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails({
        user: userResponse.data.data,
        orders: ordersResponse.data,
        cart: cartResponse.data,
      });
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to fetch user details.");
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setUserDetails(null);
  };

  const handleConfirmAction = async () => {
    const { action, userId } = confirmModal;
    try {
      let payload = {};
      if (action === "block") payload = { blocked: true };
      if (action === "unblock") payload = { blocked: false };
      if (action === "delete") payload = { active: false };
      if (action === "restore") payload = { active: true };

      await api.patch(
        `register/${userId}/`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(`User ${action}ed successfully.`);
      setError("");
      fetchUsers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(`Failed to ${action} user.`);
    } finally {
      setConfirmModal({ show: false, action: "", userId: null });
    }
  };

  // const handleBlockUser = async (id) => {
  //   if (window.confirm("Are you sure you want to block this user?")) {
  //     try {
  //       await api.patch(`register/${id}/`, {
  //         blocked: true,
  //       },{headers: {
  //   Authorization: `Bearer ${token}`,
  // },
  //     });
  //       setMessage("User blocked successfully.");
  //       setError("");
  //       fetchUsers();
  //       setTimeout(() => setMessage(""), 3000);
  //     } catch (error) {
  //       console.error("Error blocking user:", error);
  //       setError("Failed to block user.");
  //     }
  //   }
  // };

  // const handleUnblockUser = async (id) => {
  //   if (window.confirm("Are you sure you want to unblock this user?")) {
  //     try {
  //       await api.patch(`register/${id}/`, {
  //         blocked: false,
  //       },{headers: {
  //   Authorization: `Bearer ${token}`,
  // },
  //     });
  //       setMessage("User unblocked successfully.");
  //       setError("");
  //       fetchUsers();
  //       setTimeout(() => setMessage(""), 3000);
  //     } catch (error) {
  //       console.error("Error unblocking user:", error);
  //       setError("Failed to unblock user.");
  //     }
  //   }
  // };

  // const handleSoftDeleteUser = async (id) => {
  //   if (window.confirm("Are you sure you want to soft delete this user?")) {
  //     try {
  //       await api.patch(`register/${id}/`, {
  //         active: false,
  //       },{headers: {
  //   Authorization: `Bearer ${token}`,
  // },
  //     });
  //       setMessage("User soft deleted successfully.");
  //       setError("");
  //       fetchUsers();
  //       setTimeout(() => setMessage(""), 3000);
  //     } catch (error) {
  //       console.error("Error soft deleting user:", error);
  //       setError("Failed to soft delete user.");
  //     }
  //   }
  // };

  // const handleRestoreUser = async (id) => {
  //   if (window.confirm("Are you sure you want to restore this user?")) {
  //     try {
  //       await api.patch(`register/${id}/`, {
  //         active: true,
  //       },{headers: {
  //   Authorization: `Bearer ${token}`,
  // },
  //     });
  //       setMessage("User restored successfully.");
  //       setError("");
  //       fetchUsers();
  //       setTimeout(() => setMessage(""), 3000);
  //     } catch (error) {
  //       console.error("Error restoring user:", error);
  //       setError("Failed to restore user.");
  //     }
  //   }
  // };

  return (
    <Container className="py-5">
      <h2>User Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Active</th>
            <th>Blocked</th>
            <th>Actions</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.active ? "Yes" : "No"}</td>
              <td>{user.blocked ? "Yes" : "No"}</td>
              <td>
                {user.role !== "admin" && (
                  <>
                    {user.blocked ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openConfirmModal("unblock", user.id)}
                        className="me-2"
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openConfirmModal("block", user.id)}
                        className="me-2"
                      >
                        Block
                      </Button>
                    )}
                    {user.active ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => openConfirmModal("delete", user.id)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openConfirmModal("restore", user.id)}
                      >
                        Restore
                      </Button>
                    )}
                  </>
                )}
                {user.role === "admin" && (
                  <span className="text-muted">Admin</span>
                )}
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => fetchUserDetails(user.id)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userDetails && (
            <div>
              <h4>User Information</h4>
              <p>
                <strong>ID:</strong> {userDetails.user.id}
              </p>

              <p>
                <strong>Name:</strong> {userDetails.user.name}
              </p>
              <p>
                <strong>Username:</strong> {userDetails.user.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.user.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.user.phn}
              </p>
              <p>
                <strong>Role:</strong> {userDetails.user.role}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {userDetails.user.active ? "Yes" : "No"}
              </p>
              <p>
                <strong>Blocked:</strong>{" "}
                {userDetails.user.blocked ? "Yes" : "No"}
              </p>

              <h4 className="mt-3">Order History</h4>
              {userDetails.orders.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product ID</th>
                      <th>Quantity</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails.orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.product}</td>
                        <td>{order.quantity}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No order history available.</p>
              )}

              <h4 className="mt-3">Cart Details</h4>
              {userDetails.cart.length > 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Cart Item ID</th>
                      <th>Product ID</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDetails.cart.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.productId}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No items in the cart.</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={confirmModal.show}
        onHide={() =>
          setConfirmModal({ show: false, action: "", userId: null })
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm {confirmModal.action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {confirmModal.action} this user?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setConfirmModal({ show: false, action: "", userId: null })
            }
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            Yes, {confirmModal.action}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserManagement;
