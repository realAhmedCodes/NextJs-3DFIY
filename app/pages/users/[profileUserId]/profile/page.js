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
} from "@/components/ui/dialog";
import Reviews from "@/app/componets/Reviews/Reviews";

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
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* User Profile Card */}
        <Card className="w-full md:w-1/3">
          <CardHeader className="flex flex-col items-center">
            {userDetail?.profile_pic && (
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={profilePicPath} alt={userDetail?.name} />
                <AvatarFallback>
                  {userDetail?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="text-3xl">{userDetail?.name}</CardTitle>
            <CardDescription className="text-xl text-gray-600">
              {userDetail?.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{userDetail?.bio}</p>
            <p className="text-lg font-bold text-blue-500 mb-2">
              Rating: {userDetail?.ratings}
            </p>
            <p className="text-lg mb-2">
              Seller Type: {userDetail?.sellerType}
            </p>
            {userDetail?.sellerType === "Designer" && (
              <div>
                <h2 className="text-xl font-semibold mt-6">Uploaded Models</h2>
                {userDetail?.models?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {userDetail.models.map((model) => (
                      <Card key={model.model_id} className="shadow">
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
                            className="w-full h-auto rounded-md mt-2"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No models uploaded yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders and Chat Section */}
        <div className="flex-grow">
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending Orders</TabsTrigger>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <PendingOrder profileUserId={profileUserId} />
            </TabsContent>
            <TabsContent value="active">
              <ActiveOrder profileUserId={profileUserId} />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex space-x-4">
            {userDetail?.sellerType === "Designer" && (
              <Dialog open={ModelOrderShow} onOpenChange={setModelOrderShow}>
                <DialogTrigger asChild>
                  <Button>Place Order</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Place an Order</DialogTitle>
                  </DialogHeader>
                  <ModelOrder
                    sellerId={userDetail?.sellerId}
                    userId={currentUser}
                  />
                </DialogContent>
              </Dialog>
            )}
            <Button onClick={() => setShowChat(!showChat)}>Message</Button>
          </div>
          <div>
           <Reviews profileId={profileUserId}></Reviews>
          </div>
          {showChat && currentUser && (
            <div className="mt-6">
              <ChatComponent
                currentUser={currentUser}
                roomId={generatedRoomId}
                otherUser={otherUser}
                onClose={() => setShowChat(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/* <ChatList
              currentUser={currentUser}
              onSelectChat={handleSelectChat}
            /> */

/*
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import ChatComponent from "@/componets/Chat";
import ChatList from "@/componets/ChatList";

const Page = () => {
  const { roomId, userId } = useParams(); // Extract roomId and userId from URL if they exist
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRoomId, setActiveRoomId] = useState(roomId || null); // Manage active roomId
  const [otherUser, setOtherUser] = useState(userId || null); // Set otherUser from params or null for new chats

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;
        setCurrentUser(userId);
      } catch (error) {
        console.error("Invalid token");
      }
    }
    setLoading(false);
  }, []);

  const handleStartNewChat = (otherUserId) => {
    const generatedRoomId = [currentUser, otherUserId].sort().join("-");
    setActiveRoomId(generatedRoomId);
    setOtherUser(otherUserId); // Keep track of other user for first-time chat
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex">
      {currentUser && (
        <>
          <ChatList
            currentUser={currentUser}
            onSelectChat={(roomId, otherUserId) => {
              setActiveRoomId(roomId);
              setOtherUser(otherUserId);
            }}
          />
          {activeRoomId && (
            <ChatComponent
              currentUser={currentUser}
              roomId={activeRoomId}
              otherUser={otherUser}
              onNewChatInitiate={handleStartNewChat}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Page;
*/

/* {showChat === false ? (
        <></>
      ) : (
        <>
         
          {currentUser && (
            <>
              <ChatList
                currentUser={currentUser}
                onSelectChat={handleSelectChat}
              />
              <ChatComponent
                currentUser={currentUser}
                roomId={activeRoomId}
                otherUser={otherUser}
              />
            </>
          )}
        </>
      )}*/
