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
  Printer,
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

const fetcher = (url) => fetch(url).then((res) => res.json());

const printerData = {
  specifications: [
    { name: "Print Volume", value: "250 x 250 x 300 mm" },
    { name: "Layer Resolution", value: "50-400 microns" },
    { name: "Print Speed", value: "Up to 150 mm/s" },
    { name: "Nozzle Diameter", value: "0.4 mm" },
    { name: "Filament Diameter", value: "1.75 mm" },
  ],
};

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
    ? `${printer.profile_pic.split("\\").pop()}`
    : null;

  return (
    // <div className="container mx-auto p-8">
    //   <Card className="max-w-4xl mx-auto">
    //     {printer.image && (
    //       <img
    //         src={`/uploads/${printer.image}`}
    //         alt={printer.printer_name}
    //         className="object-cover w-full h-96 rounded-t-lg"
    //       />
    //     )}
    //     <CardContent>
    //       <div className="flex items-start justify-between mb-4">
    //         <div>
    //           <CardTitle className="text-3xl">{printer.printer_name}</CardTitle>
    //           <div className="flex items-center space-x-2">
    //             <span className="text-gray-600">{printer.user_location}</span>
    //           </div>
    //         </div>
    //         {printer.profile_pic && (
    //           <Avatar className="w-16 h-16">
    //             <AvatarImage src={profilePicPath} alt={printer.user_name} />
    //             <AvatarFallback>
    //               {printer.user_name?.charAt(0).toUpperCase()}
    //             </AvatarFallback>
    //           </Avatar>
    //         )}
    //       </div>
    //       <hr className="my-4" />
    //       <CardDescription className="mb-4">
    //         {printer.description}
    //       </CardDescription>
    //       {printer.materials && (
    //         <div className="mb-4">
    //           <h2 className="text-xl font-semibold mb-2">Materials</h2>
    //           <p className="text-gray-700">{printer.materials}</p>
    //         </div>
    //       )}
    //       {printer.price && (
    //         <div className="mb-4">
    //           <h2 className="text-xl font-semibold mb-2">Price</h2>
    //           <p className="text-gray-700">${printer.price}</p>
    //         </div>
    //       )}
    //       {sellerType === "Printer Owner" && (
    //         <div className="mt-4 flex space-x-2">
    //           <Button onClick={updateModelBtn} >
    //             Update Printer
    //           </Button>
    //           <Button onClick={delModelBtn} variant="destructive">
    //             Delete Printer
    //           </Button>
    //         </div>
    //       )}
    //       <div className="mt-4">
    //         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    //           <DialogTrigger asChild>
    //             <Button>Place an Order</Button>
    //           </DialogTrigger>
    //           <DialogContent>
    //             <DialogHeader>
    //               <DialogTitle>Place an Order</DialogTitle>
    //             </DialogHeader>
    //             <PrinterOrder printerId={printerId} />
    //           </DialogContent>
    //         </Dialog>
    //       </div>
    //     </CardContent>
    //   </Card>
    //   <div><Reviews printerId={printerId}></Reviews></div>
    // </div>

    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="p-0">
            <div className="w-full">
              <Dialog>
                <DialogTrigger className="overflow-hidden">
                  <div className="relative rounded-lg bg-black">
                    <img
                      src={`/uploads/` + printer.image}
                      alt={printer.name}
                      className="object-cover w-full max-h-[500px] rounded-t-lg"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="p-1 lg:max-w-4xl md:max-w-3xl text-white">
                  <img
                    src={`/uploads/` + printer.image}
                    alt={printer.name}
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
                  </span>{" "}
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
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <table className="w-full">
                      <tbody>
                        {printerData.specifications.map((spec, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2 font-medium">{spec.name}</td>
                            <td className="py-2 text-right">{spec.value}</td>
                          </tr>
                        ))}
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
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profilePicPath} alt={printer.user_name} />
                  <AvatarFallback>{printer.user_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{printer.user_name}</h2>
                  <p className="text-sm text-muted-foreground">Printer Owner</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" size={20} />
                  <span className="font-semibold">{""}</span>
                  <span className="text-muted-foreground ml-1">
                    ({"N/A"} reviews)
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock size={16} className="mr-1" />
                  <span>Quick responses</span>
                </div>
              </div>
              {sellerType === "Printer Owner" && (
                <div className="mt-4 flex space-x-2">
                  <Button onClick={updateModelBtn}>Update Printer</Button>
                  <Button onClick={delModelBtn} variant="destructive">
                    Delete Printer
                  </Button>
                </div>
              )}
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
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Printer Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Printer className="mr-2 h-4 w-4" />
                  <span>High Resolution</span>
                </div>
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Easy Setup</span>
                </div>
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Multiple Materials</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Cost-Effective</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Reviews printerId={printerId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
