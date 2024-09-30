"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PrinterOrderData from "../orderDetail/PrinterOrderData";
import ModelOrderData from "../orderDetail/ModelOrderData";
import { useSelector } from "react-redux";
import useSWR from "swr";

// Fetcher function for SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export const PendingOrder = ({ profileUserId }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const router = useRouter();

  // Get user info from Redux
  const { userId, sellerType, sellerId } = useSelector((state) => state.user);

  // Fetch pending orders conditionally based on sellerType
  const { data: usersPrinterOrders, error: usersPrinterError } = useSWR(
    sellerType === "Regular" ?
     `/api/orders/userId/${userId}` : null,
    fetcher
  );

  const { data: usersModelOrders, error: usersModelError } = useSWR(
    sellerType === "Regular"
      ? ` /api/orders/userPendingOrders/${userId}`
      : null,
    fetcher
  );

  const { data: ownersPrinterOrders, error: ownersPrinterError } = useSWR(
    sellerType === "Printer Owner"
      ? `/api/orders/printerOwners/${sellerId}`
      : null,
    fetcher
  );

  const { data: ownersModelOrders, error: ownersModelError } = useSWR(
    sellerType === "Designer"
      ? `/api/orders/designerPendingOrders/${sellerId}`
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
console.log("id check",selectedOrderId);
  return (
    <div>
      {Number(userId) === Number(profileUserId) ? (
        <>
          <h1 className="text-xl font-bold mb-2">Your Pending Orders</h1>

          {/* For Printer Owners */}
          {sellerType === "Printer Owner" &&
            ownersPrinterOrders?.length > 0 && (
              <div>
                <h2>Printer Owner Pending Orders</h2>
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
                    <p>{printerOrder.created_at}</p>
                    {Number(selectedOrderId) ===
                      Number(printerOrder.pending_order_id) && (
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
            <div>
              <h2>Designer Pending Orders</h2>
              {ownersModelOrders.map((modelOrder) => (
                <div
                  key={modelOrder.order_id}
                  onClick={() => setSelectedOrderId(modelOrder.order_id)}
                  className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
                >
                  <p>
                    <strong>Status:</strong> {modelOrder.status}
                  </p>
                  <p>
                    <strong>Client Name:</strong> {modelOrder.user_name}
                  </p>
                  <p>{modelOrder.created_at}</p>
                  <p>{modelOrder.order_id}</p>
                  {Number(selectedOrderId) ===
                    Number(modelOrder.order_id) && (
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
                  <h2>User Printer Pending Orders</h2>
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
                  <h2>User Model Pending Orders</h2>
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
    </div>
  );
};

export default PendingOrder;
