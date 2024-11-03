// components/ModelPage.jsx
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
import Navbar from "@/app/componets/Navbar";


const ModelPage = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [isLiked, setIsLiked] = useState(null);
  const [isSaved, setIsSaved] = useState(null);

  const router = useRouter();

  const { userId, sellerType, sellerId } = useSelector((state) => state.user);

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
    router.push(`/models/${modelId}/updateModel`);
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
     <Navbar></Navbar>
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
      </div>
    </div>
  );
};

export default ModelPage;
