"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
//import stripePromise from "@/lib/stripe"; 
import PaymentModal from "../../customModelPayment/PaymentModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import PrinterOrderData from "../../orderDetail/PrinterOrderData";
import ModelOrderData from "../../orderDetail/ModelOrderData";
import { Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const UserActiveOrder = ({ profileUserId }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [currentOrder, setCurrentOrder] = useState(null);
  // Get user info from Redux

 const { userId, sellerType, sellerId, authToken } = useSelector(
   (state) => state.user
 );

 const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  // Fetch orders for regular users
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
console.log(userId, "ye hai ative ka")
  // Handle errors
  if (usersPrinterError || usersModelError) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">
          Error loading orders. Please try again later.
        </p>
      </div>
    );
  }

  // Loading state
  if (!usersPrinterOrders && !usersModelOrders) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  const handleAccordionChange = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

   const handleBuy = (order) => {
     if (!userId) {
       router.push("/login");
       return;
     }

     setCurrentOrder(order); // Set the current order
     setIsModalOpen(true);
   };

  return (
    <div>
      {Number(userId) === Number(profileUserId) ? (
        <>
          {usersPrinterOrders?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Active Printer Orders
              </h2>
              <Accordion type="single" collapsible>
                {usersPrinterOrders.map((order) => (
                  <AccordionItem
                    key={order.pending_order_id}
                    value={order.pending_order_id.toString()}
                  >
                    <AccordionTrigger
                      onClick={() =>
                        handleAccordionChange(order.pending_order_id)
                      }
                      className="flex justify-between items-center p-4 bg-white rounded-md shadow mb-2"
                    >
                      <div>
                        <p className="font-semibold">
                          Order #{order.pending_order_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <Badge variant="outline" className="ml-1">
                            {order.status}
                          </Badge>
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <PrinterOrderData orderId={order.pending_order_id} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {usersModelOrders?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Active Designer Orders
              </h2>
              <Accordion type="single" collapsible>
                {usersModelOrders.map((order) => (
                  <AccordionItem
                    key={order.order_id}
                    value={order.order_id.toString()}
                  >
                    <AccordionTrigger
                      onClick={() => handleAccordionChange(order.order_id)}
                      className="flex justify-between items-center p-4 bg-white rounded-md shadow mb-2"
                    >
                      <div>
                        <p className="font-semibold">Order #{order.order_id}</p>
                        <p className="text-sm text-gray-500">
                          Status:{" "}
                          <Badge variant="outline" className="ml-1">
                            {order.status}
                          </Badge>
                        </p>
                      </div>

                      {order.order_file_status === "Submitted" ? (
                        <Button
                          onClick={() => handleBuy(order)} // Pass the specific order
                          className="ml-4"
                        >
                          Get File
                        </Button>
                      ) : null}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ModelOrderData orderId={order.order_id} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </>
      ) : null}

      {isModalOpen && currentOrder && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            model={currentOrder} // Pass the specific order
            userId={userId}
            authToken={authToken}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              // Optional: Refresh data or update state after successful payment
              setIsModalOpen(false);
            }}
          />
        </Elements>
      )}
    </div>
  );
};

export default UserActiveOrder;
