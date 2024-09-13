"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrinterOrderData from "../orderDetail/PrinterOrderData";
import ModelOrderData from "../orderDetail/ModelOrderData";
export const ActiveOrder = ({ userId, sellerType, sellerId }) => {
 const [usersPrinterOrders, setUsersPrinterOrders] = useState([]);
 const [OwnersPrinterOrders, setOwnersPrinterOrders] = useState([]);
 const [usersModelOrders, setUsersModelOrders] = useState([]);
 const [OwnersModelOrders, setOwnersModelsOrders] = useState([]);
 const [selectedOrderId, setSelectedOrderId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/orders/userId/${userId}/printerActiveOrders`);
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



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/orders/userId/${userId}/designerActiveOrders`
        );
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
        const response = await fetch(`/api/orders/printerActiveOrders/${sellerId}`);
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
        const response = await fetch(
          `/api/orders/desingerActiveOrders/${sellerId}`
        );
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
      <h1 className="text-xl font-bold mb-2">Your Active Orders</h1>
      {sellerType === "Printer Owner" ? (
        <>
          <div>Printer owner</div>
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
          <div>Model owner</div>
          {OwnersModelOrders.map((printerOrder) => (
            <div
              key={printerOrder.pending_order_id}
              onClick={() => setSelectedOrderId(printerOrder.order_id)} // Set selected order on click
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
                  <ModelOrderData orderId={printerOrder.pending_order_id} />
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}

      <div>
        {sellerType === "Regular" || sellerType === "Designer" ? (
          <>
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
      </div>
    </div>
  );
};

export default ActiveOrder;
