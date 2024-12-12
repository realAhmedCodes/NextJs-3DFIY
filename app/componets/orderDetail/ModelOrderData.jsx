import React, { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import {
  Calendar,
  Package,
  User,
  FileType,
  CuboidIcon as Cube,
  Download,
  Check,
  Star,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModelOrder from "../PlaceOrder/Model_Order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrinterOrder from "../PlaceOrder/SellerOrders/Printer_Orders";
import { toast } from "sonner";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ModelOrderData = ({ orderId, downloadFile, printersData }) => {
  const [reason, setReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);
  const [error, setError] = useState(null);

  const { data: orderData, error: fetchError } = useSWR(
    orderId ? `/api/orders/orderData/ModelOrderData/${orderId}` : null,
    fetcher
  );

  const { userId, email, profile_pic, sellerType } = useSelector(
    (state) => state.user
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
    <Card className="w-full mx-auto">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Model Order Details
          </CardTitle>
          <Badge
            variant={orderData.status === "pending" ? "default" : "success"}
            className="text-sm font-medium"
          >
            {orderData.status.charAt(0).toUpperCase() +
              orderData.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="details">Order Details</TabsTrigger>
            <TabsTrigger value="printers">Available Printers</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Client:</span>
                  <span>{orderData.user_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Model:</span>
                  <span>{orderData.model_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Order Date:</span>
                  <span>
                    {new Date(orderData.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileType className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">File Format:</span>
                  <span>{orderData.file_format}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description:</h3>
                  <p className="text-sm text-gray-600">
                    {orderData.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Dimensions:</h3>
                  <div className="flex items-center justify-center bg-gray-100 p-4 rounded-lg">
                    <Cube className="w-24 h-24 text-gray-400" />
                    <div className="ml-4 text-sm">
                      <p>Width: {orderData.dimensions.width}cm</p>
                      <p>Height: {orderData.dimensions.height}cm</p>
                      <p>Length: {orderData.dimensions.length}cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
              {orderData.order_file_status === "Paid" && (
                <Button
                  onClick={downloadFile}
                  className="flex items-center -mt-24"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </Button>
              )}

              {orderData.status === "pending" && (
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleAction("accepted")}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => setIsDeclining(true)}
                    variant="outline"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="printers">
            {printersData ? (
              printersData.map((seller, index) => (
                <>
                  <p className="text-2xl font-bold mb-4">Available Printers</p>
                  <Card
                    key={index}
                    className="flex flex-col w-1/4 items-center p-6"
                  >
                    <Image
                      alt={`${seller.Users.name}'s profile`}
                      className="rounded-full mb-4"
                      height={100}
                      src={
                        seller.Users.profile_pic
                          ? seller.Users.profile_pic
                          : `/placeholder.svg`
                      }
                      style={{
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                      }}
                      width={100}
                    />
                    <h3 className="text-lg font-semibold capitalize">
                      {seller.Users.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {seller.Users.sellerType}
                    </p>
                    <div className="flex items-center">
                      <span className="ml-1 text-sm font-medium">
                        {seller.ratings !== null && (
                          <div className="flex items-center justify-center  mt-2">
                            {[...Array(seller.ratings)].map((_, index) => (
                              <Star
                                className={
                                  "fill-yellow-400 text-yellow-400 mr-1"
                                }
                                size={20}
                              />
                            ))}

                            {[...Array(5 - seller.ratings)].map((_, index) => (
                              <Star
                                className={"mr-1 text-gray-300"}
                                size={20}
                              />
                            ))}
                          </div>
                        )}
                      </span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="mt-2">Place Order</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Place an Order</DialogTitle>
                        </DialogHeader>
                        <PrinterOrder printerId={seller.printer_owner_id} />
                      </DialogContent>
                    </Dialog>
                  </Card>
                </>
              ))
            ) : (
              <div className="flex items-center justify-center">
                <p>No Printers Found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <AlertDialog open={isDeclining} onOpenChange={setIsDeclining}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Order</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for declining this order. This will be
              sent to the client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for declining (required)"
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeclining(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleAction("denied")}
              className="bg-red-500 hover:bg-red-600"
            >
              Submit Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ModelOrderData;
