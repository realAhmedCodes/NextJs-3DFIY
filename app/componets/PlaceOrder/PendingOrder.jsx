"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrinterOrderData from "../orderDetail/PrinterOrderData";
import ModelOrderData from "../orderDetail/ModelOrderData";
export const Page = ({ userId, sellerType, sellerId }) => {
  const [usersPrinterOrders, setUsersPrinterOrders] = useState([]);
  const [OwnersPrinterOrders, setOwnersPrinterOrders] = useState([]);
  const [usersModelOrders, setUsersModelOrders] = useState([]);
  const [OwnersModelOrders, setOwnersModelsOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // State to track selected order
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/orders/userId/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ordersData = await response.json();
        if (Array.isArray(ordersData)) {
          setUsersPrinterOrders(ordersData);
        } else if (ordersData) {
          setUsersPrinterOrders([ordersData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [userId]);



console.log("pen", userId)
console.log("printer selller id", sellerId)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/orders/userPendingOrders/${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ordersData = await response.json();
        if (Array.isArray(ordersData)) {
          setUsersModelOrders(ordersData);
        } else if (ordersData) {
          setUsersModelOrders([ordersData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [userId]);


  useEffect(() => {
    const fetchPrinterOrders = async () => {
      try {
        const response = await fetch(`/api/orders/printerOwners/${sellerId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ordersData = await response.json();
        if (Array.isArray(ordersData)) {
          setOwnersPrinterOrders(ordersData);
        } else if (ordersData) {
          setOwnersPrinterOrders([ordersData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchPrinterOrders();
  }, [sellerId]);



  
  useEffect(() => {
    const fetchPrinterOrders = async () => {
      try {
        const response = await fetch(`/api/orders/designerPendingOrders/${sellerId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ordersData = await response.json();
        if (Array.isArray(ordersData)) {
          setOwnersModelsOrders(ordersData);
        } else if (ordersData) {
          setOwnersModelsOrders([ordersData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchPrinterOrders();
  }, [sellerId]);
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Your Pending Orders</h1>

      {sellerType === "Printer Owner" ? (
        <>
          <div>owner printer orders</div>
          {OwnersPrinterOrders.map((printerOrder) => (
            <div
              key={printerOrder.pending_order_id}
              onClick={() => setSelectedOrderId(printerOrder.pending_order_id)} // Set selected order on click
              className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
            >
              <p>
                <strong>Status:</strong> {printerOrder.status}
              </p>
              <p>
                <strong>Client Name:</strong> {printerOrder.user_name}
              </p>
              <p>{printerOrder.created_at}</p>
              {selectedOrderId === printerOrder.pending_order_id && (
                <div>
                  <PrinterOrderData orderId={printerOrder.pending_order_id} />
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      {sellerType === "Designer" ? (
        <>
          <div>owners model orders</div>
          {OwnersModelOrders.map((OwnersModelOrder) => (
            <div
              key={OwnersModelOrder.order_id}
              onClick={() => setSelectedOrderId(OwnersModelOrder.order_id)} // Set selected order on click
              className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
            >
              <p>
                <strong>Status:</strong> {OwnersModelOrder.status}
              </p>
              <p>
                <strong>Client Name:</strong> {OwnersModelOrder.user_name}
              </p>
              <p>{OwnersModelOrder.created_at}</p>
              {selectedOrderId === OwnersModelOrder.order_id && (
                <div>
                  <ModelOrderData
                    orderId={OwnersModelOrder.order_id}
                  />
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      <div>
        {sellerType === "Regular" ||
        sellerType === "Designer" ||
        sellerType === "Printer Owner" ? (
          <>
            <div>User Printer orders</div>
            {usersPrinterOrders.map((order) => (
              <div
                key={order.pending_order_id}
                className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
              >
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Printer Owner:</strong> {order.printer_owner_name}
                </p>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}

        {sellerType === "Regular" ||
        sellerType === "Designer" ||
        sellerType === "Printer Owner" ? (
          <>
            <div>User Model Orders</div>
            {usersModelOrders.map((order) => (
              <div
                key={order.pending_order_id}
                className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
              >
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Client Owner:</strong> {order.designer_name}
                </p>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Page;
