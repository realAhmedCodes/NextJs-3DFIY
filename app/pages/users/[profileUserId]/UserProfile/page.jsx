"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import ChatComponent from "@/app/componets/Chat";
import PendingOrder from "@/app/componets/PlaceOrder/PendingOrder";
import ActiveOrder from "@/app/componets/PlaceOrder/ActiveOrder";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProfilePage = () => {
  const { profileUserId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // For carousel pagination
  const designersPerPage = 3; // Number of designers to display at once
  const { userId, name } = useSelector((state) => state.user);
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/models/getModel");
        const modelsData = await response.json();
        setModels(Array.isArray(modelsData) ? modelsData : [modelsData]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { data: users } = useSWR("/api/users/getUsers/getDesigners", fetcher);

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

  const profilePicPath = userDetail?.profile_pic
    ? `/uploads/${userDetail.profile_pic.split("\\").pop()}`
    : "";

  const handleNext = () => {
    if (currentPage < Math.ceil(users.length / designersPerPage) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedUsers = users?.slice(
    currentPage * designersPerPage,
    currentPage * designersPerPage + designersPerPage
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen pt-24">
      {/* Top bar with greeting */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">
          Hi, {userDetail?.name || name}!
        </h1>
      </div>

     
      <h2 className="text-2xl font-semibold mb-4">3D Models For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))
          : models.map((model) => (
              <Card
                key={model.model_id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                  {model.image && (
                    <Image
                      src={`/uploads/${model.image}`}
                      alt={model.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{model.name}</h3>
                <p className="text-gray-500 mb-2">{model.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {model.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-green-500 font-semibold">
                    {model.is_free ? "Free" : `$${model.price}`}
                  </p>
                </div>
              </Card>
            ))}
      </div>

      {/* Invite Talent and Top Talent Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Invite Talent Section */}
        <div className="lg:col-span-1">
          <Card className="bg-purple-100 rounded-lg p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-purple-800">
                Refer Talent. Earn Rewards.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm mb-4">
                Invite Talent to sign up using your link and earn rewards when
                they start earning.
              </p>
              <div className="relative">
                <Input
                  className="mb-4 text-sm"
                  readOnly
                  value="yourwebsite.com/invite/your_referral_code"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-2"
                >
                  Copy
                </Button>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700"
                >
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700"
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700"
                >
                  Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Talent Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">
            Get Inspired by Top Talent
          </h2>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedUsers?.map((user) => (
                <Card
                  key={user.user_id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <Avatar className="w-16 h-16 mb-3 shadow">
                    {user.profile_pic ? (
                      <AvatarImage
                        src={`/uploads/${user.profile_pic}`}
                        alt={user.name}
                      />
                    ) : (
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.location}</p>
                  <p className="text-gray-700 mt-2">
                    Verified: {user.is_verified ? "Yes" : "No"}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() =>
                      router.push(`/pages/users/${user.user_id}/profile`)
                    }
                  >
                    Get to know me
                  </Button>
                </Card>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentPage === 0}
              >
                ←
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={
                  currentPage >= Math.ceil(users.length / designersPerPage) - 1
                }
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        <Tabs defaultValue="pending">
          <TabsList className="mb-4 space-x-4">
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
      </div>

      {/* Message Button */}
      <div className="mt-6">
        <Button
          onClick={() => setShowChat(!showChat)}
          className="bg-black text-white"
        >
          Message
        </Button>
      </div>

      {/* Chat Component */}
      {showChat && currentUser && (
        <div className="mt-6">
          <ChatComponent currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
