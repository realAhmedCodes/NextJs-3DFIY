"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import ChatComponent from "@/app/componets/Chat";
import PendingOrder from "@/app/componets/PlaceOrder/SellerOrders/PendingOrder";
import ActiveOrder from "@/app/componets/PlaceOrder/SellerOrders/ActiveOrder";
import ModelOrder from "@/app/componets/PlaceOrder/Model_Order";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Package, Zap, Award, DollarSign } from "lucide-react"


const fetcher = (url) => fetch(url).then((res) => res.json());

const ProfilePage = () => {
  const { profileUserId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [otherUser, setOtherUser] = useState(profileUserId || null);
  const [ModelOrderShow, setModelOrderShow] = useState(false);

  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    setCurrentUser(userId);
  }, [userId]);

  const {
    data: userDetail,
    error,
    isLoading,
  } = useSWR(
    profileUserId ? `/api/users/${profileUserId}/getUser` : null,
    fetcher
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load user details.</p>
      </div>
    );

  const generatedRoomId = [currentUser, otherUser].sort().join("-");

  const profilePicPath = userDetail?.profile_pic
    ? `/uploads/${userDetail.profile_pic.split("\\").pop()}`
    : "";
  console.log(profileUserId);
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 flex flex-col gap-4">

          {/* User Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={userDetail.profile_pic} alt={userDetail.name} />
                <AvatarFallback>{userDetail.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl">{userDetail.name}</CardTitle>
              <CardDescription className="text-lg">{userDetail.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{userDetail.bio}</p>
              <div className="flex items-center justify-center space-x-2">
                <Star className="text-yellow-400" />
                <span className="text-xl font-semibold">{userDetail.ratings}</span>
              </div>
              <Badge variant="secondary" className="w-full justify-center py-1 text-lg">
                {userDetail.sellerType}
              </Badge>
            </CardContent>
            <CardFooter className="justify-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Place Order</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Place an Order</DialogTitle>
                    <DialogDescription>Fill in the details to place your order with {userDetail.name}.</DialogDescription>
                  </DialogHeader>
                  {/* Add order form here */}
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => setShowChat(!showChat)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </CardFooter>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary">...</Badge>
                <Badge variant="secondary">...</Badge>
                <Badge variant="secondary">...</Badge>
                <Badge variant="secondary">...</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders and Models Section */}
        <div className="flex-grow space-y-6">
          <Tabs defaultValue="models">
            <TabsList className={"grid w-full " + (userDetail?.sellerType === "Designer" ? "grid-cols-3" : "grid-cols-2")}>
              {userDetail?.sellerType === "Designer" && (
                <TabsTrigger value="models">Models</TabsTrigger>
              )}
              <TabsTrigger value="pending">Pending Orders</TabsTrigger>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="models" className="space-y-4">
              <h2 className="text-2xl font-semibold">Uploaded Models</h2>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userDetail.models.map((model) => (
                    <Card key={model.model_id} className="flex flex-col">
                      <img src={model.image} alt={model.name} className="w-full h-40 object-cover rounded-t-lg" />
                      <CardHeader>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription>{model.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-lg font-semibold">${model.price}</span>
                          <Button size="sm">View Details</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pending">
              <ScrollArea className="h-fit w-full rounded-md border p-4">
                <div className="space-y-4">
                  <PendingOrder profileUserId={profileUserId} />
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="active">
              <ScrollArea className="h-fit w-full rounded-md border p-4">
                <div className="space-y-4">
                  <ActiveOrder profileUserId={profileUserId} />
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>



      {/* Chat Component (placeholder) */}
      {showChat && (
        <Card>
          <CardHeader>
            <CardTitle>Chat with {userDetail.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Chat interface would go here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
