// app/components/Notifications.js
// app/components/Notifications.js

// app/components/Notifications.js
// app/components/Notifications.js
// app/components/Notifications.js

// app/components/Notifications.js

"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Bell } from "lucide-react"; // Replace with your preferred icon

let socket;

const Notifications = () => {
  const { userId } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      // Initialize Socket.io client if not already initialized
      if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_SERVER_URL, {
          transports: ["websocket"],
        });

        // Listen for incoming notifications
        socket.on("notification", (notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });

        // Handle connection errors
        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
          setError("Real-time notifications are currently unavailable.");
        });
      }

      // Join the user's specific room
      socket.emit("join_room", `user_${userId}`);

      // Fetch initial notifications
      const fetchNotifications = async () => {
        try {
          const response = await axios.get("/api/notifications/getNotifications", {
            params: { user_id: userId },
          });
          setNotifications(response.data.notifications);
          const unread = response.data.notifications.filter((notif) => !notif.isRead).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error("Error fetching notifications:", err);
          setError("Failed to load notifications.");
        }
      };

      fetchNotifications();

      // Cleanup on component unmount
      return () => {
        socket.emit("leave_room", `user_${userId}`);
        socket.disconnect();
        socket = null;
      };
    }
  }, [userId]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notif) => !notif.isRead);
    const unreadIds = unreadNotifications.map((notif) => notif.id);

    if (unreadIds.length === 0) return;

    try {
      await axios.patch(
        "/api/notifications/getNotifications",
        { notificationIds: unreadIds },
        { params: { user_id: userId } } // Include user_id as query parameter
      );
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          unreadIds.includes(notif.id) ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      setError("Failed to mark notifications as read.");
    }
  };

  return (
    <div className="relative">
      <Button onClick={toggleDropdown} className="relative">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge className="absolute top-0 right-0 bg-red-500 text-white">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="link" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            {error && <Alert variant="destructive">{error}</Alert>}
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications.</p>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`p-2 mb-2 rounded ${
                      notif.isRead ? "bg-gray-100" : "bg-blue-50"
                    }`}
                  >
                    <p className="text-sm">{notif.message}</p>
                    <small className="text-xs text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
