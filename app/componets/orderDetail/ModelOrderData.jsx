"use client";
import React, { useState, useEffect } from "react";

const ModelOrderData = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [reason, setReason] = useState(""); // State to track the reason
  const [isDeclining, setIsDeclining] = useState(false); // State to control textarea visibility
console.log(orderId, "idar ki")
  useEffect(() => {
    const fetchModelOrders = async () => {
      try {
        const response = await fetch(
          `/api/orders/orderData/ModelOrderData/${orderId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const fetchedData = await response.json();
        setOrderData(fetchedData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchModelOrders();
  }, [orderId]);

  const handleAction = async (action) => {
    if (action === "denied" && !reason) {
      alert("Please provide a reason for denial.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/status/modelOrderStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          action,
          reason: action === "denied" ? reason : null,
        }),
      });
      // Handle the response if needed
    } catch (err) {
      console.error(`Error ${action} the order:`, err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Model Order Detailll</h1>
      {orderData && (
        <div className="border rounded-md p-4">
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
          <p>
            <strong>User Name:</strong> {orderData.user_name}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(orderData.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Description:</strong> {orderData.description}
          </p>
          <p>
            <strong>Model Type:</strong> {orderData.model_type}
          </p>
          <p>
            <strong>Resolution:</strong> {orderData.resolution}
          </p>
          <p>
            <strong>Complexity:</strong> {orderData.complexity}
          </p>

          {orderData.status === "pending" && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAction("accepted")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => setIsDeclining(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          )}

          {isDeclining && (
            <div className="mt-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for denial (required)"
                className="border rounded-md p-2 w-full"
              />
              <button
                onClick={() => handleAction("denied")}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2"
              >
                Submit Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelOrderData;
