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
import Reviews from "@/app/componets/Reviews/Reviews";
import {
  Printer as PrinterIcon,
  Settings,
  Package,
  DollarSign,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecentPrinterReviews from "@/app/componets/RecentPrinterReviews";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { printerId } = useParams();
  const { sellerType, sellerId, userId } = useSelector((state) => state.user);
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
      console.error("Failed to delete printer:", err);
      // Optionally, display an error message to the user
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
    ? `${printer.profile_pic.split("\\").pop()}`
    : null;
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Printer Information Section */}
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-0">
            <div className="w-full">
              <Dialog>
                <DialogTrigger className="overflow-hidden">
                  <div className="relative rounded-lg bg-black">
                    <img
                      src={`/uploads/${printer.image}`}
                      alt={printer.printer_name}
                      className="object-cover w-full max-h-[500px] rounded-t-lg cursor-pointer"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="p-1 lg:max-w-4xl md:max-w-3xl text-white">
                  <img
                    src={`/uploads/${printer.image}`}
                    alt={printer.printer_name}
                    className="rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 capitalize">
                    {printer.printer_name}
                  </h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>{printer.user_location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  <span className="text-sm text-gray-600 font-normal mr-1">
                    Starting From
                  </span>
                  ${printer.price}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-6">
                {printer.description}
              </p>
              <Tabs defaultValue="specifications" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specifications">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                </TabsList>
                <TabsContent value="specifications">
                  <ScrollArea className="h-auto w-full rounded-md border p-4">
                    <table className="w-full">
                      <tbody>
                        {printer.specifications &&
                          Object.entries(printer.specifications).map(
                            ([key, value], index) => (
                              <tr
                                key={index}
                                className="border-b last:border-b-0"
                              >
                                <td className="py-2 font-medium capitalize">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                </td>
                                <td className="py-2 text-right">{value}</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="materials">
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {printer.materials.map((material, index) => (
                        <Badge key={index} variant="outline">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Section */}
        <div className="space-y-6">
          {/* Owner Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`${profilePicPath}`}
                    alt={printer.user_name}
                  />
                  <AvatarFallback>{printer.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/pages/users/${printer.user_id}/profile`}>
                    <h2 className="text-lg font-semibold hover:underline">
                      {printer.user_name}
                    </h2>
                  </Link>
                  <p className="text-sm text-muted-foreground">Printer Owner</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-muted-foreground">
                  <Clock size={16} className="mr-1" />
                  <span>Quick responses</span>
                </div>
              </div>

              {userId === printer.user_id && (
                <>
                  <div className="mt-4 flex space-x-2">
                    <Button onClick={updateModelBtn} className="w-1/2">
                      Update Printer
                    </Button>
                    <Button
                      onClick={delModelBtn}
                      variant="destructive"
                      className="w-1/2"
                    >
                      Delete Printer
                    </Button>
                  </div>
                </>
              )}
              {sellerType !== "Printer Owner" && (
                <div className="mt-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Place an Order</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Place an Order</DialogTitle>
                      </DialogHeader>
                      <PrinterOrder printerId={printerId} />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              {printer.services && printer.services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {printer.services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No services listed.</p>
              )}
            </CardContent>
          </Card>

          {userId !== printer.user_id && (
            <>
              <div>
                <Reviews printerId={printerId} />
              </div>
            </>
          )}
          <div>
            <RecentPrinterReviews printerId={printerId}></RecentPrinterReviews>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
