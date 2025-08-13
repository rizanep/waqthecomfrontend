import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, ListGroup, Container } from "react-bootstrap";
import api from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("accessToken");
  const session = JSON.parse(localStorage.getItem("session")); // Parse stored JSON

  const fetchNotifications = async () => {
    if (!session?.id) {
      console.error("No user session found");
      return;
    }

    try {
      const res = await api.get("notifications/", {
        params: { user_id: session.id }, // send as query param ?user_id=...
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(res.data);
      console.log("Fetched notifications:", res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) return;

    try {
      await api.delete(
        "notifications/clear-all/",
        {
          params: { user_id: session.id }, // send user_id to backend for filter
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications([]); // Clear UI after delete
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
          onClick={clearAllNotifications}
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
    </Container>
  );
}
