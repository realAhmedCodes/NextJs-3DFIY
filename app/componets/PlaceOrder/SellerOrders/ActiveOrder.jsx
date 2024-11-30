"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PrinterOrderData from "../../orderDetail/PrinterOrderData";
import ModelOrderData from "../../orderDetail/ModelOrderData";

import { useSelector } from "react-redux";
import useSWR from "swr";
import UploadModelFileModal from "./UploadModelFile";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export const ActiveOrder = ({ profileUserId }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const router = useRouter();

  // Get user info from Redux
  const { userId, sellerType, sellerId } = useSelector((state) => state.user);

  // Fetch orders conditionally based on sellerType
  const { data: usersPrinterOrders, error: usersPrinterError } = useSWR(
    sellerType === "Regular"
      ? `/api/orders/userId/${userId}/printerActiveOrders`
      : null,
    fetcher
  );

  const { data: usersModelOrders, error: usersModelError } = useSWR(
    sellerType === "Regular"
      ? `/api/orders/userId/${userId}/designerActiveOrders`
      : null,
    fetcher
  );

  const { data: ownersPrinterOrders, error: ownersPrinterError } = useSWR(
    sellerType === "Printer Owner"
      ? `/api/orders/printerActiveOrders/${sellerId}`
      : null,
    fetcher
  );

  const { data: ownersModelOrders, error: ownersModelError } = useSWR(
    sellerType === "Designer"
      ? `/api/orders/desingerActiveOrders/${sellerId}`
      : null,
    fetcher
  );

  // Handle errors (optional)
  if (
    usersPrinterError ||
    usersModelError ||
    ownersPrinterError ||
    ownersModelError
  ) {
    return <div>Error loading orders. Please try again later.</div>;
  }

  // Loading states
  if (
    !usersPrinterOrders &&
    !usersModelOrders &&
    !ownersPrinterOrders &&
    !ownersModelOrders
  ) {
    return <div>Loading...</div>;
  }

  // Function to update order status to "Dispatched"
  const handleDispatchOrder = async (orderId) => {
    try {
      // Update the order status to "Dispatched"
      const statusResponse = await fetch(
        `/api/orders/printerActiveOrders/dispatchOrder/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const statusData = await statusResponse.json();

      if (!statusData.success) {
        alert("Failed to dispatch order.");
        return;
      }

      // Create notification for the user
      const notificationResponse = await fetch(
        `/api/orders/ModelOrders/orderStatus/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const notificationData = await notificationResponse.json();

      if (!notificationData.success) {
        alert("Failed to send notification.");
        return;
      }

      // Notify the user and update the UI
      alert("Order dispatched and notification sent successfully!");
    } catch (error) {
      console.error("Error dispatching order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const openModelFileUpload = (orderId) => {
    setCurrentOrderId(orderId);
    setOpenFileUploadModal(true);
  };

  const closeModelFileUpload = () => {
    setOpenFileUploadModal(false);
    setCurrentOrderId(null);
  };

  return (
    <div>
      {Number(userId) === Number(profileUserId) ? (
        <>
          <h1 className="text-xl font-bold mb-2">Your Active Orders</h1>

          {/* For Printer Owners */}
          {sellerType === "Printer Owner" &&
            ownersPrinterOrders?.length > 0 && (
              <div>
                <h2>Printer Owner Active Orders</h2>
                {ownersPrinterOrders.map((printerOrder) => (
                  <div
                    key={printerOrder.pending_order_id}
                    onClick={() =>
                      setSelectedOrderId(printerOrder.pending_order_id)
                    }
                    className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
                  >
                    <p>
                      <strong>Status:</strong> {printerOrder.status}
                    </p>
                    <p>
                      <strong>Client Name:</strong> {printerOrder.user_name}
                    </p>
                    <Button
                      onClick={() =>
                        handleDispatchOrder(printerOrder.pending_order_id)
                      }
                    >
                      Dispatch
                    </Button>
                    <p>{printerOrder.created_at}</p>
                    {selectedOrderId === printerOrder.pending_order_id && (
                      <PrinterOrderData
                        orderId={printerOrder.pending_order_id}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

          {/* For Designers */}
          {sellerType === "Designer" && ownersModelOrders?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Designer Active Orders
              </h2>
              {ownersModelOrders.map((modelOrder) => (
                <div
                  key={modelOrder.order_id}
                  className="border rounded-md p-4 mb-2 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => setSelectedOrderId(modelOrder.order_id)}
                      className="cursor-pointer"
                    >
                      <p>
                        <strong>Status:</strong> {modelOrder.status}
                      </p>
                      <p>
                        <strong>Client Name:</strong> {modelOrder.user_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(modelOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openModelFileUpload(modelOrder.order_id)}
                    >
                      Upload File
                    </Button>
                  </div>
                  {selectedOrderId === modelOrder.order_id && (
                    <ModelOrderData orderId={modelOrder.order_id} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* For Regular Users */}
          {sellerType === "Regular" && (
            <>
              {usersPrinterOrders?.length > 0 && (
                <div>
                  <h2>User Printer Active Orders</h2>
                  {usersPrinterOrders.map((order) => (
                    <div
                      key={order.pending_order_id}
                      className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
                    >
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Printer Owner:</strong>{" "}
                        {order.printer_owner_name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {usersModelOrders?.length > 0 && (
                <div>
                  <h2>User Model Active Orders</h2>
                  {usersModelOrders.map((order) => (
                    <div
                      key={order.pending_order_id}
                      className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
                    >
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Designer:</strong> {order.designer_name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        ""
      )}

      {openFileUploadModal && currentOrderId && (
        <UploadModelFileModal
          orderId={currentOrderId}
          onClose={closeModelFileUpload}
        />
      )}
    </div>
  );
};

export default ActiveOrder;
