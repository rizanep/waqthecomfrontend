import React, { useEffect, useState } from "react";
import { Button, ListGroup, Container, Modal } from "react-bootstrap";
import api from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false); // modal state
  const token = localStorage.getItem("accessToken");
  const session = JSON.parse(localStorage.getItem("session")); // Parse stored JSON

  const fetchNotifications = async () => {
    if (!session?.id) {
      console.error("No user session found");
      return;
    }

    try {
      const res = await api.get("notifications/", {
        params: { user_id: session.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("notifications/clear-all/", {
        params: { user_id: session.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications([]); // Clear UI after delete
      setShowModal(false); // Close modal
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Notifications</h4>
      {notifications.length > 0 && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowModal(true)} // open modal
          className="mb-3"
        >
          Clear All
        </Button>
      )}

      <ListGroup>
        {notifications.length === 0 ? (
          <ListGroup.Item>No notifications</ListGroup.Item>
        ) : (
          notifications.map((n) => (
            <ListGroup.Item key={n.id}>
              <div>{n.message}</div>
              <small className="text-muted">
                {new Date(n.created_at).toLocaleString()}
              </small>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear All Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to clear all notifications? This action cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearAll}>
            Yes, Clear All
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
