"use client";
import React, { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ModelOrderData = ({ orderId }) => {
  const [reason, setReason] = useState(""); // State to track the reason
  const [isDeclining, setIsDeclining] = useState(false); // State to control textarea visibility

  // Use SWR to fetch the order data
  const { data: orderData, error } = useSWR(
    orderId ? `/api/orders/orderData/ModelOrderData/${orderId}` : null,
    fetcher
  );

  // Handle errors
  if (error) return <div>Error loading order data.</div>;
  if (!orderData) return <div>Loading...</div>;

  // Handle order status action
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
      // Handle response if needed
    } catch (err) {
      console.error(`Error ${action} the order:`, err);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Model Order Details</h1>
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

        {/* Accept or Decline buttons for pending orders */}
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
    </div>
  );
};

export default ModelOrderData;
