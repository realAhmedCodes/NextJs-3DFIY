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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProfilePage = () => {
  const { profileUserId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [otherUser, setOtherUser] = useState(profileUserId || null);
  const [modelOrderShow, setModelOrderShow] = useState(false);

  // Retrieve persisted data (assuming userId is stored as 'userId')
  const persistRoot =
    typeof window !== "undefined" ? localStorage.getItem("persist:root") : null;
  const data = persistRoot ? JSON.parse(persistRoot) : {};
  const authUser = data.userId || "";

  console.log("authUser", authUser);

  // Get userId from Redux store
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    setCurrentUser(userId);
  }, [userId]);

  // Fetch user details using SWR
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
    ? `${userDetail.profile_pic.split("\\").pop()}`
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r h-64 container mx-auto mt-10 rounded-xl from-gray-800 to-gray-900 text-white py-10"></header>

      <div className="container -mt-16 mx-auto flex flex-col items-center">
        <Avatar className="w-32 h-32 mb-4 shadow-lg">
          {userDetail?.profile_pic ? (
            <AvatarImage
              src={profilePicPath}
              alt={userDetail?.name || "User"}
            />
          ) : (
            <AvatarFallback>
              {userDetail?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="text-4xl capitalize">
          {userDetail?.name || "Unnamed User"}
        </CardTitle>
        <CardDescription>
          {userDetail?.location || "Unknown Location"}
        </CardDescription>
        <p className="mt-2 w-96 text-center">
          {userDetail?.bio || "No bio available."}
        </p>
        <div className="flex space-x-4 mt-4">
          <span className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0l-3.376 2.455c-.785.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.005 9.393c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.966z" />
            </svg>
            {userDetail?.ratings !== undefined ? userDetail.ratings : "N/A"}
          </span>
          <span className="text-lg font-semibold text-blue-300">
            {userDetail?.sellerType || "Unknown Type"}
          </span>
        </div>

        <div className="flex space-x-4 mt-4">
          <Button onClick={() => setShowChat(!showChat)}>Message</Button>
          <Dialog open={modelOrderShow} onOpenChange={setModelOrderShow}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary">
                Place Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Place an Order</DialogTitle>
              </DialogHeader>
              <ModelOrder
                sellerId={userDetail?.sellerId || ""}
                userId={currentUser || ""}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex mx-auto max-w-7xl ">
        <div className="w-full max-w-7xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              {userDetail?.user_id == authUser && (
                <>
                  <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                  <TabsTrigger value="active">Active Orders</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{userDetail?.bio || "No bio available."}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Seller Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      Location: {userDetail?.location || "Unknown"}
                    </p>
                    <p className="text-lg font-semibold">
                      Rating:{" "}
                      {userDetail?.ratings !== undefined
                        ? userDetail.ratings
                        : "N/A"}
                    </p>
                    <p className="text-lg font-semibold">
                      Seller Type: {userDetail?.sellerType || "Unknown"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <PendingOrder profileUserId={profileUserId} />
            </TabsContent>

            <TabsContent value="active">
              <ActiveOrder profileUserId={profileUserId} />
            </TabsContent>

            <TabsContent value="models">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Uploaded Models</h2>
                </div>
                {userDetail?.models && userDetail.models.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userDetail.models.map((model) => (
                      <Card key={model.model_id} className="shadow-md">
                        <CardHeader>
                          <CardTitle>{model.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{model.description}</p>
                          <p className="font-bold mt-2">
                            Price: ${model.price}
                          </p>
                          <img
                            src={`/uploads/${model.image}`}
                            alt={model.name}
                            className="w-full h-48 object-cover rounded-md mt-2"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No models uploaded yet.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Component */}
        {showChat && currentUser && (
          <div className="fixed bottom-20 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
            <ChatComponent
              currentUser={currentUser}
              roomId={generatedRoomId}
              otherUser={otherUser || ""}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
