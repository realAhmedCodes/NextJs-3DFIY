"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import ChatComponent from "@/app/componets/Chat";
import UserPendingOrder from "@/app/componets/PlaceOrder/UserOrders/UserPendingOrder";

import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Loader2,
  Inbox,
  ArrowLeft,
  ArrowRight,
  Copy,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

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
          {userError ? "Failed to load user details." : "Failed to load users."}
        </p>
      </div>
    );

  const profilePicPath = userDetail?.profile_pic
    ? `${userDetail.profile_pic.split("\\").pop()}`
    : "";

  const handleNext = () => {
    if (users && currentPage < Math.ceil(users.length / designersPerPage) - 1) {
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

    console.log("userDetail", userDetail);
    
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <header className="bg-primary h-32 text-primary-foreground p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-primary-foreground">
                <AvatarImage
                  src={userDetail.profilePic}
                  alt={userDetail.name}
                />
                <AvatarFallback className="capitalize text-2xl font-bold text-primary">
                  {userDetail.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  Hi, {userDetail.name}!
                </h1>
                <p className="text-sm opacity-90">{userDetail.bio}</p>
              </div>
            </div>
            <Button onClick={() => setShowChat(true)} variant="secondary">
              <Inbox className="mr-2 h-4 w-4" />
              Inbox
            </Button>
          </div>
        </header>

        {/* Orders Section */}
        <div className="mb-8 max-w-7xl mx-auto mt-6">
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
                  <UserActiveOrder
                    profileUserId={profileUserId}
                  ></UserActiveOrder>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 3D Models Section */}
        <div className="mb-12 max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">3D Models For You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingModels ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-lg" />
              ))
            ) : models.length > 1 ? (
              models.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <Image
                    src={model.image}
                    alt={model.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{model.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {model.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="space-x-1">
                        {model.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span
                        className={
                          model.is_free
                            ? "text-green-500 font-semibold"
                            : "text-blue-500 font-semibold"
                        }
                      >
                        {model.is_free ? "Free" : `$${model.price}`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-red-500">No Models Found.</p>
            )}
          </div>
        </div>

        {/* Invite Talent and Top Talent Section */}
        <Card className="bg-secondary max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle className="text-secondary-foreground">
              Refer Talent. Earn Rewards.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary-foreground mb-4">
              Invite talented individuals to join our platform and earn rewards
              when they start earning.
            </p>
            <div className="relative mb-4">
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
                    className="absolute right-0 top-0 h-full"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FaLinkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <FaTwitter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-7xl mx-auto mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Get Inspired by Top Talent</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentPage === 0}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext} disabled={currentPage >= Math.ceil(users.length / 3) - 1}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayedUsers.slice(currentPage * 3, (currentPage + 1) * 3).map(designer => (
                  <Card key={designer.id} className="flex flex-col items-center p-4">
                    <Avatar className="w-20 h-20 mb-4">
                      <AvatarImage src={designer.profile_pic} alt={designer.name} />
                      <AvatarFallback>{designer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-center">{designer.name}</h3>
                    <p className="text-sm text-muted-foreground text-center mb-2">{designer.location}</p>
                    {designer.is_verified && <Badge variant="secondary">Verified</Badge>}
                    <Button variant="outline" className="mt-4 w-full" onClick={() => router.push(`/pages/users/${designer.id}/profile`)}>
                      Get to know me
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
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
