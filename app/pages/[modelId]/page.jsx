"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Alert } from "@/components/ui/alert";
import {
  Edit,
  Trash,
  Heart,
  HeartFilled,
  Bookmark,
  BookMarked,
  Loader2,
  Info,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Import your PaymentModal component
import PaymentModal from "@/app/componets/modelPurchase/PaymentModal";
import Reviews from "@/app/componets/Reviews/Reviews";

// Initialize Stripe
const stripePromiseClient = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);

const ModelPage = () => {
  const { modelId } = useParams(); // Extract modelId from the URL
  const router = useRouter();

  // State variables
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Access user data from Redux store
  const { userId, sellerType, sellerId, authToken } = useSelector(
    (state) => state.user
  );

  // Fetch model details
  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await axios.get(`/api/models/${modelId}/modelDetail`);
        setModel(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch model details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchModelDetail();
  }, [modelId]);

  // Fetch like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `/api/models/${modelId}/modelLike?user_id=${userId}`
          );
          setIsLiked(response.data.liked);
        } catch (err) {
          setError(
            err.response?.data?.message || "Failed to fetch like status"
          );
        }
      }
    };

    fetchLikeStatus();
  }, [modelId, userId]);

  // Fetch saved status
  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `/api/models/${modelId}/saveModel?user_id=${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch saved status");
          }
          const data = await response.json();
          setIsSaved(data.saved);
        } catch (error) {
          setError(error.message || "Failed to fetch saved status");
        }
      }
    };

    fetchSavedStatus();
  }, [modelId, userId]);

  // Check purchase status
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (userId && model) {
        try {
          const response = await axios.get(
            `/api/modelPayment/check-purchase?modelId=${model.model_id}&userId=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setHasPurchased(response.data.purchased);
        } catch (error) {
          console.error("Error checking purchase status:", error);
        }
      }
    };

    checkPurchaseStatus();
  }, [userId, model, authToken]);

  // Handle like/unlike button
  /*const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.delete(
          `/api/models/${modelId}/modelUnlike?user_id=${userId}`
        );
      } else {
        await axios.post(`/api/models/${modelId}/modelLike`, {
          user_id: userId,
        });
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to update like status", err);
      setError("Unable to update like status. Please try again.");
    }
  };*/
const handleLike = async () => {
  try {
    if (isLiked) {
      await axios.delete(`/api/models/${modelId}/modelLike`, {
        params: { user_id: userId },
      });
    } else {
      await axios.post(`/api/models/${modelId}/modelLike`, {
        user_id: userId,
      });
    }
    setIsLiked(!isLiked);
  } catch (err) {
    console.error("Failed to update like status", err);
    setError("Unable to update like status. Please try again.");
  }
};
  // Handle save/unsave button
  const handleSave = async () => {
    try {
      if (isSaved) {
        await axios.delete(
          `/api/models/${modelId}/unsaveModel?user_id=${userId}`
        );
      } else {
        await axios.post(`/api/models/${modelId}/saveModel`, {
          user_id: userId,
        });
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Failed to update save status", err);
      setError("Unable to update save status. Please try again.");
    }
  };

  // Navigate to update model page
  const handleUpdateModel = () => {
    router.push(`/models/${modelId}/updateModel`);
  };

  // Handle model deletion
  const handleDeleteModel = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this model? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/models/delete?user_id=${userId}&model_id=${modelId}`
      );
      // Redirect after deletion
      router.push("/models");
    } catch (err) {
      console.error("Failed to delete model", err);
      setError("Unable to delete model. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle buy button click
  const handleBuy = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    setIsModalOpen(true);
  };

  // Handle download button
  const handleDownload = async () => {
    try {
      if (model.type === "scraped" && model.downloadLink) {
        // For scraped models, redirect to the external download link
        window.open(model.downloadLink, "_blank");
      } else if (model.type === "designer") {
        // For designer models, initiate download via internal API
        router.push(`/api/download?modelId=${model.model_id}`);
      } else {
        throw new Error("Invalid model type for download");
      }
    } catch (error) {
      console.error("Error downloading model:", error);
      setError("Failed to download the model. Please try again.");
    }
  };

  // Handle purchase success
  const handlePurchaseSuccess = () => {
    setHasPurchased(true);
    setIsModalOpen(false);
  };

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  // No Model Found
  if (!model) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="warning">No model found.</Alert>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Model Details Card */}
        <Card className="shadow-lg">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 self-center md:h-full ">
              {model.image_url && (
                <Carousel>
                  <CarouselContent>
                    {/* If multiple images are available, map through them */}
                    {model.images && model.images.length > 0 ? (
                      model.images.map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Image
                              src={img.url}
                              alt={`${model.model_name} Image ${index + 1}`}
                              width={800}
                              height={600}
                              className="rounded-lg aspect-[4/3] object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))
                    ) : model.image_url ? (
                      <CarouselItem>
                        <div className="p-1">
                          <Image
                            src={model.image_url}
                            alt={model.model_name}
                            width={800}
                            height={600}
                            className="rounded-lg aspect-[4/3] object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ) : null}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2" />
                  <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2" />
                </Carousel>
              )}
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div className="m-4">
                {/* Author Info */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Avatar className="mr-3">
                      {model.type === "designer" &&
                      model.user &&
                      model.user.profile_pic ? (
                        <Image
                          src={model.user.profile_pic}
                          alt={model.user.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <Info className="w-6 h-6 text-gray-500" />
                      )}
                    </Avatar>
                    {model.type === "designer" && model.user && (
                      <div>
                        <p className="text-lg font-semibold text-gray-700">
                          {model.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {model.user.location}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Like and Save Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Like Button */}
                    <Button
                      variant="ghost"
                      onClick={handleLike}
                      aria-label={isLiked ? "Unlike" : "Like"}
                      className="p-2"
                    >
                      {isLiked ? (
                        <HeartFilled className="text-red-500 w-6 h-6" />
                      ) : (
                        <Heart className="w-6 h-6" />
                      )}
                    </Button>

                    {/* Save Button */}
                    <Button
                      variant="ghost"
                      onClick={handleSave}
                      aria-label={isSaved ? "Unsave" : "Save"}
                      className="p-2"
                    >
                      {isSaved ? (
                        <Bookmark className="text-primary fill-primary w-6 h-6" />
                      ) : (
                        <Bookmark className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Model Name */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {model.model_name}
                </h1>

                {/* Description */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600">
                    {model.description ||
                      "This is a detailed description of the model. It provides insights into the features, specifications, and other relevant information that potential users might find useful."}
                  </p>
                </div>

                {/* Specifications */}
                {model.type === "scraped" && model.specifications && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      Specifications
                    </h2>
                    <p className="text-gray-600">{model.specifications}</p>
                  </div>
                )}

                {/* Formats */}
                {model.type === "scraped" && model.formats && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      Formats
                    </h2>
                    <p className="text-gray-600">{model.formats}</p>
                  </div>
                )}

                {/* Tags */}
                {model.tags && model.tags.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="font-medium text-gray-800"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Pricing
                  </h2>
                  {model.is_free ? (
                    <Badge className="font-bold text-white text-lg px-4 bg-green-500 cursor-auto">
                      Free
                    </Badge>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">
                      ${model.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="m-4">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  {/* Purchase Section */}
                  <div>
                    {model.is_free || hasPurchased ? (
                      <Button
                        onClick={handleDownload}
                        className="w-full md:w-auto"
                      >
                        Download
                      </Button>
                    ) : (
                      <Button
                        onClick={handleBuy}
                        className="w-full md:w-auto"
                        disabled={purchaseLoading}
                      >
                        {purchaseLoading ? "Processing..." : "Buy Now"}
                      </Button>
                    )}
                  </div>

                  {/* Existing Seller Controls */}
                  {sellerType === "Designer" &&
                    model.designer_id === sellerId && (
                      <div className="flex space-x-4">
                        {/* Update Button */}
                        <Button
                          variant="outline"
                          onClick={handleUpdateModel}
                          className="flex items-center"
                        >
                          <Edit className="w-5 h-5 mr-2" />
                          Update Model
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="destructive"
                          onClick={handleDeleteModel}
                          className="flex items-center"
                          disabled={isDeleting}
                        >
                          <Trash className="w-5 h-5 mr-2" />
                          {isDeleting ? "Deleting..." : "Delete Model"}
                        </Button>
                      </div>
                    )}
                </div>

                {/* Display Purchase Error */}
                {purchaseError && (
                  <Alert variant="destructive" className="mt-4">
                    {purchaseError}
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reviews Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            <p className="text-gray-600">
              Be the first to review this model. Share your experience and help
              others make informed decisions.
            </p>
            <Button variant="primary" className="mt-4" disabled>
              Write a Review
            </Button>
          </Card>

          {/* Related Models Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Related Models
            </h2>
            <div className="space-y-4">
              {/* Example Related Model */}
              {model.relatedModels && model.relatedModels.length > 0 ? (
                model.relatedModels.map((relatedModel) => (
                  <div
                    key={relatedModel.model_id}
                    className="flex items-center space-x-4"
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={relatedModel.image_url}
                        alt={relatedModel.model_name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {relatedModel.model_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {relatedModel.is_free
                          ? "Free"
                          : `$${relatedModel.price}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No related models found.</p>
              )}
            </div>
          </Card>
        </div>

     
      </div>

      {/* Payment Modal */}
      {isModalOpen && (
        <Elements stripe={stripePromiseClient}>
          <PaymentModal
            model={model}
            userId={userId}
            authToken={authToken}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handlePurchaseSuccess}
          />
        </Elements>
      )}
    </div>
  );
};

export default ModelPage;
