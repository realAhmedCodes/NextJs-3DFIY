"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import ChatComponent from "@/app/componets/Chat";
import UserPendingOrder from "@/app/componets/PlaceOrder/UserOrders/UserPendingOrder";
import UserActiveOrder from "@/app/componets/PlaceOrder/UserOrders/UserActiveOrder";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Loader2, Inbox, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProfilePage = () => {
  const { profileUserId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [models, setModels] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const designersPerPage = 3;
  const { userId, name } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(userId);
  }, [userId]);

  const {
    data: userDetail,
    error: userError,
    isLoading: userLoading,
  } = useSWR(
    profileUserId ? `/api/users/${profileUserId}/getUser` : null,
    fetcher
  );

  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR("/api/users/getUsers/getDesigners", fetcher);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models/getModel");
        const modelsData = await response.json();
        setModels(Array.isArray(modelsData) ? modelsData : [modelsData]);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  if (userLoading || usersLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );

  if (userError || usersError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          {userError
            ? "Failed to load user details."
            : "Failed to load users."}
        </p>
      </div>
    );

  const profilePicPath = userDetail?.profile_pic
    ? `${userDetail.profile_pic.split("\\").pop()}`
    : "";

  const handleNext = () => {
    if (
      users &&
      currentPage < Math.ceil(users.length / designersPerPage) - 1
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayedUsers = Array.isArray(users)
    ? users.slice(
        currentPage * designersPerPage,
        currentPage * designersPerPage + designersPerPage
      )
    : [];

  return (
    <TooltipProvider> {/* Wrap the component with TooltipProvider */}
      <div className="container mx-auto p-6 bg-gray-50 min-h-screen pt-24">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              {profilePicPath ? (
                <AvatarImage src={profilePicPath} alt={userDetail?.name || name} />
              ) : (
                <AvatarFallback>{(userDetail?.name || name)?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Hi, {userDetail?.name || name}!
              </h1>
              <p className="text-gray-600">
                {userDetail?.bio || "Welcome to your profile page."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowChat(true)}
            className="bg-black text-white flex items-center space-x-2"
          >
            <Inbox className="h-4 w-4" />
            <span>Inbox</span>
          </Button>
        </div>

        {/* Orders Section */}
        <div className="mb-12">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                  <TabsTrigger value="active">Active Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  <UserPendingOrder profileUserId={profileUserId} />
                </TabsContent>
                <TabsContent value="active">
                  <UserActiveOrder profileUserId={profileUserId} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 3D Models Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">3D Models For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingModels
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-80 w-full rounded-lg" />
                ))
              : models.map((model) => (
                  <Card
                    key={model.model_id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <div className="relative h-48 rounded-t-lg overflow-hidden">
                      {model.image ? (
                        <Image
                          src={`/uploads/${model.image}`}
                          alt={model.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
                      <p className="text-gray-600 mb-4 flex-1">
                        {model.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {model.tags?.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p
                          className={`font-semibold ${
                            model.is_free ? "text-green-500" : "text-blue-500"
                          }`}
                        >
                          {model.is_free ? "Free" : `$${model.price}`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>

        {/* Invite Talent and Top Talent Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Invite Talent Section */}
          <div className="lg:col-span-1">
            <Card className="bg-purple-100 rounded-lg p-6 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">
                  Refer Talent. Earn Rewards.
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  Invite talented individuals to join our platform and earn rewards when they start earning.
                </p>
                <div className="relative">
                  <Input
                    readOnly
                    value="yourwebsite.com/invite/your_referral_code"
                    className="pr-24"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-0 top-0 h-full rounded-l-none"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "yourwebsite.com/invite/your_referral_code"
                          );
                        }}
                      >
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy to clipboard</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Talent Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-2xl">
                  Get Inspired by Top Talent
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="p-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleNext}
                    disabled={
                      users
                        ? currentPage >=
                          Math.ceil(users.length / designersPerPage) - 1
                        : true
                    }
                    className="p-2"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedUsers?.map((user) => (
                    <Card
                      key={user.user_id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center p-4"
                    >
                      <Avatar className="w-20 h-20 mb-4 shadow-md">
                        {user.profile_pic ? (
                          <AvatarImage
                            src={`/uploads/${user.profile_pic}`}
                            alt={user.name}
                          />
                        ) : (
                          <AvatarFallback>
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.location}</p>
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Component */}
        {showChat && currentUser && (
          <ChatComponent
            currentUser={currentUser}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default ProfilePage;
