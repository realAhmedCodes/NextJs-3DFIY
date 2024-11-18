// pages/models/[modelId].jsx

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
import { Edit, Trash } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Import your PaymentModal component
import PaymentModal from "@/app/componets/modelPurchase/PaymentModal";

const stripePromiseClient = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const ModelPage = () => {
  const { modelId } = useParams(); // Extract modelId from the URL
  const [model, setModel] = useState(null); // Store model details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isLiked, setIsLiked] = useState(null); // Like status
  const [isSaved, setIsSaved] = useState(null); // Save status
  const [hasPurchased, setHasPurchased] = useState(false); // Purchase status
  const [purchaseLoading, setPurchaseLoading] = useState(false); // Purchase loading state
  const [purchaseError, setPurchaseError] = useState(null); // Purchase error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const router = useRouter();

  // Access user data from Redux store
  const { userId, sellerType, sellerId, authToken } = useSelector(
    (state) => state.user
  );

  // Fetch model details from the updated API
  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await fetch(`/api/models/${modelId}/modelDetail`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Model not found");
          } else {
            throw new Error("Failed to fetch model details");
          }
        }
        const data = await response.json();
        setModel(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModelDetail();
  }, [modelId]);

  // Fetch like status for the model
  useEffect(() => {
    if (userId) {
      const fetchLikeStatus = async () => {
        try {
          const response = await fetch(
            `/api/models/${modelId}/modelLike?user_id=${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch like status");
          }
          const data = await response.json();
          setIsLiked(data.liked);
        } catch (error) {
          setError(error.message);
        }
      };
      fetchLikeStatus();
    }
  }, [modelId, userId]);

  // Fetch saved status for the model
  useEffect(() => {
    if (userId) {
      const fetchSavedStatus = async () => {
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
          setError(error.message);
        }
      };
      fetchSavedStatus();
    }
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
                Authorization: `Bearer ${authToken}`, // Replace with your auth mechanism
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
  const likeBtn = async () => {
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
    }
  };

  // Handle save/unsave button
  const saveBtn = async () => {
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
    }
  };

  // Navigate to update model page
  const updateModelBtn = () => {
    router.push(`/pages/models/${modelId}/updateModel`);
  };

  // Handle model deletion
  const delModelBtn = async () => {
    try {
      await axios.delete(
        `/api/models/delete?user_id=${userId}&model_id=${modelId}`
      );
      // Redirect after deletion
      router.push("/models");
    } catch (err) {
      console.error("Failed to delete model", err);
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

  // Handle free download or download after purchase
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No model found</p>
      </div>
    );
  }
console.log(model, "ddd")
  return (
    <div>
      <div className="container mx-auto p-8">
        <Card className="max-w-4xl mx-auto">
          {/* Model Image */}
          {model.image_url && (
            <div className="relative h-96 w-full">
              {/* Conditional Image Rendering based on model type */}
              {model.type === "scraped" ? (
                <Image
                  src={model.image_url}
                  alt={model.model_name}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <Image
                  src={model.image_url}
                  alt={model.model_name}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </div>
          )}

          <div className="p-6">
            {/* Model Header */}
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{model.model_name}</h1>
              <div className="flex items-center">
                {/* Display user avatar only for designer models */}
                {model.type === "designer" && model.user && (
                  <Avatar className="mr-2">
                    {model.user.profile_pic ? (
                      <Image
                        src={model.user.profile_pic}
                        alt={model.user.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <span>{model.user.name.charAt(0)}</span> // Fallback initial
                    )}
                  </Avatar>
                )}
                {/* Display user details only for designer models */}
                {model.type === "designer" && model.user && (
                  <div>
                    <p className="text-lg font-semibold">{model.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {model.user.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Specifications for Scraped Models */}
            {model.type === "scraped" && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Specifications</h2>
                <p className="text-gray-600">
                  {model.specifications || "Specifications not available"}
                </p>
              </div>
            )}

            {/* Formats for Scraped Models */}
            {model.type === "scraped" && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Formats</h2>
                <p className="text-gray-600">{model.formats || "N/A"}</p>
              </div>
            )}

            {model.type === "scraped" &&
              model.tags &&
              model.tags.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            {/* Model Description */}
            <p className="text-gray-700 mb-4">{model.description}</p>

            {/* Like and Save Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button variant="ghost" onClick={likeBtn}>
                  {isLiked ? (
                    <>
                      <span className="ml-1">Unlike</span>
                    </>
                  ) : (
                    <>
                      <span className="ml-1">Like</span>
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={saveBtn}>
                  {isSaved ? (
                    <>
                      <span className="ml-1">Unsave</span>
                    </>
                  ) : (
                    <>
                      <span className="ml-1">Save</span>
                    </>
                  )}
                </Button>
              </div>
              <div>
                {model.is_free ? (
                  <p className="text-xl font-bold text-green-500">Free</p>
                ) : (
                  <p className="text-xl font-bold">${model.price}</p>
                )}
              </div>
            </div>

            {/* Purchase Section */}
            <div className="mt-4 flex items-center space-x-4">
              {model.is_free || hasPurchased ? (
                <Button onClick={handleDownload} className="ml-4">
                  Download
                </Button>
              ) : (
                <Button
                  onClick={handleBuy}
                  className="ml-4"
                  disabled={purchaseLoading}
                >
                  {purchaseLoading ? "Processing..." : "Buy Now"}
                </Button>
              )}
            </div>

            {/* Display Purchase Error */}
            {purchaseError && (
              <Alert variant="destructive" className="mt-4">
                {purchaseError}
              </Alert>
            )}

            {/* Existing Seller Controls */}
            {sellerType === "Designer" && model.designer_id === sellerId && (
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" onClick={updateModelBtn}>
                  <Edit className="h-5 w-5 mr-1" />
                  Update Model
                </Button>
                <Button variant="destructive" onClick={delModelBtn}>
                  <Trash className="h-5 w-5 mr-1" />
                  Delete Model
                </Button>
              </div>
            )}
          </div>
        </Card>
        <div>{/* Any additional content */}</div>
      </div>

      {/* Payment Modal */}
      <div>
        {isModalOpen && (
          <Elements stripe={stripePromiseClient}>
            <PaymentModal
              model={model}
              userId={userId}
              authToken={authToken}
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                setHasPurchased(true);
                setIsModalOpen(false);
              }}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
  export default ModelPage;
