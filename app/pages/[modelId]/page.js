//ModelPage.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";
import PurchaseModal from "@/app/componets/modelPurchase/PurchaseModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Alert } from "@/components/ui/alert";
import { Edit, Trash } from "lucide-react";
import stripePromise from "@/lib/stripe"; 

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Import your PaymentModal component (we'll create this next)
import PaymentModal from "@/app/componets/modelPurchase/PaymentModal";
const ModelPage = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [isLiked, setIsLiked] = useState(null);
  const [isSaved, setIsSaved] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false); // New state
  const [purchaseLoading, setPurchaseLoading] = useState(false); // New state
  const [purchaseError, setPurchaseError] = useState(null); // New state
 const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  const { userId, sellerType, sellerId, authToken } = useSelector(
    (state) => state.user
  ); // Assuming authToken is stored here

  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await fetch(`/api/models/${modelId}/modelDetail`);
        if (!response.ok) {
          throw new Error("Failed to fetch model details");
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

  const updateModelBtn = () => {
    router.push(`/pages/models/${modelId}/updateModel`);
  };

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
const handleBuy = async () => {
  if (!userId) {
    router.push("/login");
    return;
  }

  setIsModalOpen(true);
};

  const handleFreeDownload = async () => {
    try {
      // Initiate download, possibly by redirecting to the download API route
      router.push(`/api/download?modelId=${model.model_id}`);
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

  return (
    <div>
      <div className="container mx-auto p-8">
        <Card className="max-w-4xl mx-auto">
          {model.image && (
            <div className="relative h-96 w-full">
              <Image
                src={`/uploads/${model.image}`}
                alt={model.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{model.name}</h1>
              <div className="flex items-center">
                {model.profile_pic && (
                  <Avatar className="mr-2">
                    <Image
                      src={`/uploads/${model.profile_pic}`}
                      alt={model.user_name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Avatar>
                )}
                <div>
                  <p className="text-lg font-semibold">{model.user_name}</p>
                  <p className="text-sm text-gray-500">{model.user_location}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{model.description}</p>
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
              {model.is_free ? (
                <Button onClick={handleFreeDownload} className="ml-4">
                  Download Now
                </Button>
              ) : hasPurchased ? (
                <Button onClick={handleFreeDownload} className="ml-4">
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
      <div>
        <div>
    
    {isModalOpen && (
      <Elements stripe={stripePromise}>
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
    </div>
  );
};

export default ModelPage;
