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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ModelHeader from "@/components/ModelHeader";
import ModelDetails from "@/components/ModelDetails";
import ModelActions from "@/components/ModelActions";
import ModelGallery from "@/components/ModelGallery";
import RelatedModels from "@/components/RelatedModels";
import ReviewSection from "@/components/ReviewSection";
// import PaymentModal from '@/components/PaymentModal'
import { toast } from "sonner";

// Import your PaymentModal component

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
  const [showAllTags, setShowAllTags] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
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
        toast.error(
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
          toast.error(err.response?.data?.message);
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
          toast.error(error.message || "Failed to fetch saved status");
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
          toast.error("Error checking purchase status:", error);
        }
      }
    };

    checkPurchaseStatus();
  }, [userId, model, authToken]);

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
      toast.success("Model liked successfully.");
    } catch (err) {
      console.error("Failed to update like status", err);
      toast.error("Unable to update like status. Please try again.");
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
      toast.error("Unable to update save status. Please try again.");
    }
  };

  // Navigate to update model page
  /*const handleUpdateModel = () => {
    router.push(`/pages/updateModel/${modelId}`);
  };
*/
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
      toast.error("Unable to delete model. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle buy button click
  const handleBuy = async () => {
    if (!userId) {
      router.push("/pages/Login");
      return;
    }

    setIsModalOpen(true);
  };

  // Handle download button
  const handleDownload = async () => {
    try {
      if (model.type === "scraped" && model.downloadLink) {
        // For scraped models, open the external download link
        window.open(model.downloadLink, "_blank");
      } else if (model.type === "designer") {
        const response = await fetch(`/api/models/${model.model_id}/download`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-id": userId,
          },
        });

        const data = await response.json;

        if (response.ok) {
          // The file download is handled by the browser automatically when the file is streamed
          const fileBlob = await response.blob(); // Get the blob from the response
          const fileURL = window.URL.createObjectURL(fileBlob); // Create a download URL
          const a = document.createElement("a");
          a.href = fileURL;
          a.download = model.model_name || "model.obj"; // Set default file name
          a.click(); // Trigger the download
        } else {
          // Handle errors (e.g., file not found or user not authorized)
          throw new Error(data.error || "Failed to download the model.");
        }
      } else {
        toast.error("Invalid model type for download");
        throw new Error("Invalid model type for download");
      }
    } catch (error) {
      toast.error("Failed to download the model. Please try again.");
      console.error("Error downloading model:", error);
      // setError("Failed to download the model. Please try again.");
    }
  };

  console.log(model);

  const handleTags = () => {
    setShowAllTags(!showAllTags);
  };

  // Handle purchase success
  const handlePurchaseSuccess = () => {
    setHasPurchased(true);
    toast.success("Purchase successful!");
    window.location.reload();
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
  console.log(model)

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {model.type === "designer" && (
          <ModelHeader
            model={model}
            isLiked={isLiked}
            isSaved={isSaved}
            onLike={handleLike}
            onSave={handleSave}
          />
        )}

        {model.type === "scraped" && (
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {model.model_name}
            </h1>
            <Badge className="w-fit h-fit">External Models</Badge>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-2/3">
            <ModelGallery img={model.image_url} />
          </div>
          <div className="lg:w-1/3">
            <ModelActions
              model={model}
              modelUserId={model.user.user_id}
              modelId={modelId}
              desginerId={model.designer_id}
              hasPurchased={hasPurchased}
              onBuy={handleBuy}
              onDownload={() => handleDownload()}
              isCurrentUserSeller={false}
              authToken={authToken}
              userId={userId}
              handlePurchaseSuccess={handlePurchaseSuccess}
              onUpdateModel={() =>
                router.push(`/models/${params.modelId}/updateModel`)
              }
              onDeleteModel={() => console.log("Delete clicked")}
            />
            <RelatedModels relatedModels={model.relatedModels} />
          </div>
        </div>
       
        <ModelDetails model={model} />

      
      </div>
    </div>
  );
};

export default ModelPage;
