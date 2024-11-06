import React, { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ModelOrderData = ({ orderId }) => {
  const [reason, setReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);
  const [error, setError] = useState(null);

  const { data: orderData, error: fetchError } = useSWR(
    orderId ? `/api/orders/orderData/ModelOrderData/${orderId}` : null,
    fetcher
  );

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
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      // Optionally, you can revalidate the SWR data here
    } catch (err) {
      setError(err.message);
    }
  };

  if (fetchError)
    return (
      <Alert variant="destructive" className="mb-4">
        Error loading order data.
      </Alert>
    );

  if (!orderData)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  console.log(orderData);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Model Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        <div className="space-y-2">
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
          <p>
            <strong>User Name:</strong> {orderData.user_name}
          </p>
          <p>
            <strong>Model Name:</strong> {orderData.model_name}
          </p>
          <p>
            <strong>Order Date:</strong>{" "}
            {new Date(orderData.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Description:</strong> {orderData.description}
          </p>
          <p>
            <strong>Model Type:</strong> {orderData.file_format}
          </p>
          <p>
            <strong>Dimensions: </strong>
            {orderData.dimensions ? (
              <span>
                Width: {orderData.dimensions.width}, Height:{" "}
                {orderData.dimensions.height}, Length:{" "}
                {orderData.dimensions.length}
              </span>
            ) : (
              "Not available"
            )}
          </p>
        </div>

        {orderData.status === "pending" && (
          <div className="flex space-x-4 mt-6">
            <Button onClick={() => handleAction("accepted")} variant="success">
              Accept
            </Button>
            <Button onClick={() => setIsDeclining(true)} variant="destructive">
              Decline
            </Button>
          </div>
        )}

        {isDeclining && (
          <div className="mt-4">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for denial (required)"
              className="mb-2"
            />
            <Button
              onClick={() => handleAction("denied")}
              variant="destructive"
            >
              Submit Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelOrderData;
