// app/pages/ProfilePage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr"; // Import useSWRConfig for mutate
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
  CardFooter,
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Award } from "lucide-react";
import RatingComponent from "@/app/componets/ratings/Ratings";
import { toast } from "sonner"; // Use Sonner's toast
import Reviews from "@/app/componets/Reviews/Reviews";
import Link from "next/link";

// Update import aliases to avoid conflicts
import RecentSalesDesigner from "@/app/componets/sales/modelRecentSales/RecentSales";
import RecentModelOrderPayments from "@/app/componets/sales/customModelsRecentPayments/RecentSales";
import RecentPrintedModelsSales from "@/app/componets/sales/printedModelSales/RecentSales";
import RecentDesignerReviews from "@/app/componets/RecentDesignerReviews";

const fetcher = (url: string) => fetch(url).then((res) => res.json());


const ProfilePage = () => {
  const { profileUserId } = useParams();
  const [currentUser, setCurrentUser] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [otherUser, setOtherUser] = useState<number | null>(
    profileUserId ? parseInt(profileUserId as string, 10) : null
  );
  const [ModelOrderShow, setModelOrderShow] = useState(false);
  const [rating, setRating] = useState<number>(0); // Initialize to 0
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false); // Modal state
  const { userId, sellerId } = useSelector((state: any) => state.user);
  const router = useRouter();
  const { mutate } = useSWRConfig(); // Initialize mutate

  const {
    data: userDetail,
    error,
    isLoading,
  } = useSWR(
    profileUserId ? `/api/users/${profileUserId}/getUser` : null,
    fetcher
  );

  useEffect(() => {
    setCurrentUser(userId);
    if (userDetail) {
      setRating(userDetail.ratings || 0); // Correctly set the rating
    }
  }, [userId, userDetail]);

  // Determine if the current user is viewing their own profile
  const isOwnProfile = currentUser === userDetail?.user_id;

  const handleRatingSubmit = async () => {
    try {
      // Adjust the API endpoint based on sellerType
      const ratingEndpoint =
        userDetail?.sellerType === "Designer"
          ? `/api/ratings/designers/${profileUserId}/postRatings`
          : `/api/ratings/printers/${profileUserId}/postRatings`;

      const response = await fetch(ratingEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: Number(rating) }), // Send the new rating value
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setIsRatingModalOpen(false);
        setRating(result.rating); // Update the rating displayed
        mutate(`/api/users/${profileUserId}/getUser`); // Revalidate SWR data
      } else {
        toast.error(result.error || "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error submitting rating.");
    }
  };

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

  const handleButtonClick = (model_id: number) => {
    console.log("Clicked model ID:", model_id);
    router.push(`/pages/ModelDetail/${model_id}`);
  };

  const generatedRoomId =
    currentUser && otherUser ? [currentUser, otherUser].sort().join("-") : "";

  const profilePicPath = userDetail?.profile_pic
    ? `/uploads/${userDetail.profile_pic.split("\\").pop()}`
    : "/default.png"; // Fallback to default image

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 flex flex-col gap-4">
          {/* User Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={profilePicPath} alt={userDetail.name} />
                <AvatarFallback>{userDetail.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl">{userDetail.name}</CardTitle>
              <CardDescription className="text-lg">
                {userDetail.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{userDetail.bio}</p>
              <div className="flex items-center justify-center space-x-2">
                <RatingComponent
                  rating={userDetail.ratings || 0}
                  isEditable={false}
                />
              </div>
              <Badge
                variant="secondary"
                className="w-full justify-center py-1 text-lg"
              >
                {userDetail.sellerType}
              </Badge>
            </CardContent>

            {currentUser !== userDetail.user_id && (
              <>
                {currentUser ? (
                  <CardFooter className="justify-center space-x-4">
                    {/* Place Order Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Place Order</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Place an Order</DialogTitle>
                        </DialogHeader>
                        <ModelOrder
                          sellerId={
                            userDetail?.designer_id ||
                            userDetail?.printer_owner_id
                          }
                          userId={currentUser}
                        />
                      </DialogContent>
                    </Dialog>

                    {/* Message Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setShowChat(!showChat)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-0 lg:max-w-3xl md:max-w-xl ">
                        <div>
                          <ChatComponent
                            currentUser={currentUser}
                            roomId={generatedRoomId}
                            otherUser={otherUser}
                            onClose={() => setShowChat(false)}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Rate Seller Button */}
                    <Button onClick={() => setIsRatingModalOpen(true)}>
                      Rate Seller
                    </Button>
                  </CardFooter>
                ) : (
                  <CardFooter className="w-full justify-center">
                    <Link href={"/pages/Login"}>
                      <Button>Login</Button>
                    </Link>
                  </CardFooter>
                )}
              </>
            )}
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
                <Badge variant="secondary">Achievement 1</Badge>
                <Badge variant="secondary">Achievement 2</Badge>
                <Badge variant="secondary">Achievement 3</Badge>
                <Badge variant="secondary">Achievement 4</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders and Models Section */}
        <div className="flex-grow space-y-6">
          <Tabs defaultValue={userDetail?.sellerType === "Designer" ? "models" : "printers"}>
            <TabsList className={`grid ${isOwnProfile ? 'grid-cols-4' : 'grid-cols-1'} w-full gap-2`}>
              {/* Conditionally render Models or Printers tab */}
              {userDetail?.sellerType === "Designer" ? (
                <TabsTrigger value="models">Models</TabsTrigger>
              ) : (
                <TabsTrigger value="printers">Printers</TabsTrigger>
              )}

              {/* Conditionally render Pending Orders, Active Orders, and Analytics tabs */}
              {isOwnProfile && (
                <>
                  <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                  <TabsTrigger value="active">Active Orders</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Models Tab Content for Designers */}
            {userDetail?.sellerType === "Designer" && (
              <TabsContent value="models" className="space-y-4">
                <h2 className="text-2xl font-semibold">Uploaded Models</h2>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDetail.models.map((model: any) => (
                      <Card key={model.model_id} className="flex flex-col">
                        <img
                          src={`/uploads/${model.image}`}
                          alt={model.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <CardTitle>{model.name}</CardTitle>
                          <CardDescription>{model.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-lg font-semibold">
                              ${model.price}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => handleButtonClick(model.model_id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </TabsContent>
            )}

            {/* Printers Tab Content for Printer Owners */}
            {userDetail?.sellerType === "Printer Owner" && (
              <TabsContent value="printers" className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Printers</h2>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDetail.printer.map((printer: any) => (
                      <Card key={printer.printer_id} className="flex flex-col">
                        <img
                          src={`/uploads/${printer.image}`}
                          alt={printer.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <CardTitle>{printer.name}</CardTitle>
                          <CardDescription>{printer.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-700">
                            Type: {printer.printer_type}
                          </p>
                          <p className="text-sm text-gray-700">
                            Price: ${printer.price}
                          </p>
                        </CardContent>
                        <CardFooter className="mt-auto">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-lg font-semibold">
                              Rating: {printer.rating || "N/A"}
                            </span>
                            <Button
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/pages/printers/${printer.printer_id}/Printer_Detail`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </TabsContent>
            )}

            {/* Conditionally render Pending Orders, Active Orders, and Analytics tab contents */}
            {isOwnProfile && (
              <>
                {/* Pending Orders Tab Content */}
                <TabsContent value="pending">
                  <ScrollArea className="h-fit w-full rounded-md border p-4">
                    <div className="space-y-4">
                      <PendingOrder profileUserId={profileUserId} />
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabsContent>

                {/* Active Orders Tab Content */}
                <TabsContent value="active">
                  <ScrollArea className="h-fit w-full rounded-md border p-4">
                    <div className="space-y-4">
                      <ActiveOrder profileUserId={profileUserId} />
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabsContent>

                {/* Analytics Tab Content */}
                <TabsContent value="analytics" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Recent Sales Analytics</h2>
                  <Tabs
                    defaultValue={
                      userDetail?.sellerType === "Designer"
                        ? "designer-sales"
                        : "printer-sales"
                    }
                  >
                    <TabsList
                      className={
                        userDetail?.sellerType === "Designer"
                          ? "grid grid-cols-2 gap-2"
                          : "grid grid-cols-1 gap-2"
                      }
                    >
                      {userDetail?.sellerType === "Designer" ? (
                        <>
                          <TabsTrigger value="designer-sales">
                            Recent Sales
                          </TabsTrigger>
                          <TabsTrigger value="designer-payments">
                            Model Order Payments
                          </TabsTrigger>
                        </>
                      ) : (
                        <TabsTrigger value="printer-sales">
                          Recent Printed Models Sales
                        </TabsTrigger>
                      )}
                    </TabsList>

                    {/* Nested TabsContent for Analytics */}
                    {userDetail?.sellerType === "Designer" && (
                      <>
                        <TabsContent value="designer-sales">
                          <RecentSalesDesigner designerId={sellerId} />
                        </TabsContent>
                        <TabsContent value="designer-payments">
                          <RecentModelOrderPayments designerId={sellerId} />
                        </TabsContent>
                      </>
                    )}
                    {userDetail?.sellerType === "Printer Owner" && (
                      <TabsContent value="printer-sales">
                        <RecentPrintedModelsSales printerOwnerId={sellerId} />
                      </TabsContent>
                    )}
                  </Tabs>

                  {/* Show Reviews Section */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Latest Reviews</h2>
                    {userDetail?.sellerType === "Designer" ? (
                      <RecentDesignerReviews designerId={sellerId} />
                    ) :""}
                  </div>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      {/* Rating Modal */}
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rate {userDetail.name}</DialogTitle>
            <DialogDescription>
              Please select a rating between 1 and 5 stars.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col items-center">
            <RatingComponent
              rating={rating}
              onRatingChange={setRating}
              isEditable={true}
            />
            <Button className="mt-4" onClick={handleRatingSubmit}>
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews Component: Only visible if viewing own profile */}
      {!isOwnProfile && (
        <div>
          <Reviews profileId={profileUserId} printerId={undefined} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;