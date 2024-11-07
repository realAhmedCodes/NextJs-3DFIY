"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import PrinterOrder from "@/app/componets/PlaceOrder/SellerOrders/Printer_Orders";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { printerId } = useParams();
  const { sellerType } = useSelector((state) => state.user);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: printer, error } = useSWR(
    printerId ? `/api/printers/${printerId}/printerDetail` : null,
    fetcher
  );

  const updateModelBtn = () => {
    router.push(`/pages/printers/${printerId}/Printer_Update`);
  };

  const delModelBtn = async () => {
    try {
      await axios.delete(`/api/printers/${printerId}/delete`);
      router.push("/pages/printers");
    } catch (err) {
      console.error("Failed to delete model", err);
    }
  };

  if (!printer && !error)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Error loading printer details
        </div>
      </div>
    );

  if (!printer)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No printer found</p>
      </div>
    );

  const profilePicPath = printer.profile_pic
    ? `/uploads/${printer.profile_pic.split("\\").pop()}`
    : null;

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-4xl mx-auto">
        {printer.image && (
          <img
            src={`/uploads/${printer.image}`}
            alt={printer.printer_name}
            className="object-cover w-full h-96 rounded-t-lg"
          />
        )}
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <div>
              <CardTitle className="text-3xl">{printer.printer_name}</CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{printer.user_location}</span>
              </div>
            </div>
            {printer.profile_pic && (
              <Avatar className="w-16 h-16">
                <AvatarImage src={profilePicPath} alt={printer.user_name} />
                <AvatarFallback>
                  {printer.user_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <hr className="my-4" />
          <CardDescription className="mb-4">
            {printer.description}
          </CardDescription>
          {printer.materials && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Materials</h2>
              <p className="text-gray-700">{printer.materials}</p>
            </div>
          )}
          {printer.price && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Price</h2>
              <p className="text-gray-700">${printer.price}</p>
            </div>
          )}
          {sellerType === "Printer Owner" && (
            <div className="mt-4 flex space-x-2">
              <Button onClick={updateModelBtn} variant="primary">
                Update Printer
              </Button>
              <Button onClick={delModelBtn} variant="destructive">
                Delete Printer
              </Button>
            </div>
          )}
          <div className="mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Place an Order</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Place an Order</DialogTitle>
                </DialogHeader>
                <PrinterOrder printerId={printerId} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
