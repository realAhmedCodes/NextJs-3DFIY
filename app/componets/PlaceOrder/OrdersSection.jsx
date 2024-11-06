"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import PrinterOrderData from "../orderDetail/PrinterOrderData";
import ModelOrderData from "../orderDetail/ModelOrderData";

const fetcher = (url) => fetch(url).then((res) => res.json());

const OrdersSection = ({ profileUserId }) => {
  const { userId, sellerType, sellerId } = useSelector((state) => state.user);

  // Fetch user orders
  const { data: printerOrders } = useSWR(
    `/api/orders/userId/${userId}/printerOrders`,
    fetcher
  );
  const { data: modelOrders } = useSWR(
    `/api/orders/userId/${userId}/modelOrders`,
    fetcher
  );

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleAccordionChange = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      <Tabs defaultValue="printer">
        <TabsList className="mb-4">
          <TabsTrigger value="printer">Printer Orders</TabsTrigger>
          <TabsTrigger value="designer">Designer Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="printer">
          {printerOrders && printerOrders.length > 0 ? (
            <Accordion type="single" collapsible>
              {printerOrders.map((order) => (
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
                    <Button variant="outline" size="sm">
                      {expandedOrderId === order.pending_order_id
                        ? "Hide Details"
                        : "View Details"}
                    </Button>
                  </AccordionTrigger>
                  <AccordionContent>
                    <PrinterOrderData orderId={order.pending_order_id} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>No printer orders found.</p>
          )}
        </TabsContent>
        <TabsContent value="designer">
          {modelOrders && modelOrders.length > 0 ? (
            <Accordion type="single" collapsible>
              {modelOrders.map((order) => (
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
                    <Button variant="outline" size="sm">
                      {expandedOrderId === order.order_id
                        ? "Hide Details"
                        : "View Details"}
                    </Button>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ModelOrderData orderId={order.order_id} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>No designer orders found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersSection;
