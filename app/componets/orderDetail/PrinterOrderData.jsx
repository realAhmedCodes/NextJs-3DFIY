"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { AlertCircle, CheckCircle, Clock, Printer, User, MapPin, FileText, Palette, Maximize, Shield } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from "sonner";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PrinterOrderData = ({ orderId }) => {
  const [reason, setReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);
  const [error, setError] = useState(null);
  const { userId, email, profile_pic, sellerType } = useSelector(
    (state) => state.user
  );
  const { data: orderData, error: fetchError } = useSWR(
    orderId ? `/api/orders/orderData/printerOrderData/${orderId}` : null,
    fetcher
  );

  const handleAction = async (action) => {
    if (action === "denied" && !reason) {
      alert("Please provide a reason for denial.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/status/printerOrderStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pending_order_id: orderId,
          action,
          reason: action === "denied" ? reason : null,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      // Optionally, you can revalidate the SWR data here
    } catch (err) {
      toast.error(err.message);
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

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Printer Order Details
          </CardTitle>
          <Badge
            className={`text-white px-3 py-1 rounded-full`}
          >
            {orderData.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <p>
                <strong>User Name:</strong> {orderData.user_name}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(orderData.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-1" />
              <p>
                <strong>Address:</strong> {orderData.address}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Printer className="h-5 w-5 text-gray-500" />
              <p>
                <strong>Material:</strong> {orderData.material}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-500" />
              <p>
                <strong>Color:</strong> {orderData.color}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Maximize className="h-5 w-5 text-gray-500" />
              <p>
                <strong>Resolution:</strong> {orderData.resolution}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-500" />
              <p>
                <strong>Resistance:</strong> {orderData.resistance}
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-gray-500 mt-1" />
            <div>
              <p className="font-semibold">Instructions:</p>
              <p className="text-gray-600">{orderData.instructions}</p>
            </div>
          </div>
        </div>
      </CardContent>
      {orderData.status === "pending" && sellerType === "Printer Owner" && (
        <CardFooter className="flex flex-col space-y-4">
          <Separator className="mb-4" />
          <div className="flex space-x-4 w-full">
            <Button
              onClick={() => handleAction("accepted")}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Accept Order
            </Button>
            <Button
              onClick={() => setIsDeclining(true)}
              variant="destructive"
              className="flex-1"
            >
              <AlertCircle className="mr-2 h-4 w-4" /> Decline Order
            </Button>
          </div>
          {isDeclining && (
            <div className="w-full space-y-2">
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for declining (required)"
                className="w-full"
              />
              <Button
                onClick={() => handleAction("denied")}
                variant="destructive"
                className="w-full"
              >
                Submit Decline
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default PrinterOrderData;
