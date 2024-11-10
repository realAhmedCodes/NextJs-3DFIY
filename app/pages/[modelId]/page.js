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



<<<<<<< Updated upstream
const page = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [isLiked, setIsLiked] = useState(null);
  const [isSaved, setIsSaved] = useState(null);
=======
import {
  Button
} from "@/components/ui/button";
import {
  Card
} from "@/components/ui/card";
import {
  Avatar
} from "@/components/ui/avatar";
import {
  Alert
} from "@/components/ui/alert";
import {
  Tooltip
} from "@/components/ui/tooltip";
import {
  Badge
} from "@/components/ui/badge";
import {
  Textarea
} from "@/components/ui/textarea";

import {
  Edit,
  Trash,
  Heart,
  HeartFilled,
  Save,
  SaveFilled,
  Info
} from "lucide-react";

const ModelPage = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
>>>>>>> Stashed changes



  const nav= useRouter()


  const { userId, email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );

  console.log(userId, sellerType);

  // Fetch Model Details
  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
<<<<<<< Updated upstream
        const response = await fetch(`/api/models/${modelId}/modelDetail`);
        if (!response.ok) {
          throw new Error("Failed to fetch model details");
        }
        const data = await response.json();
        setModel(data);
      } catch (err) {
        setError(err.message);
=======
        const response = await axios.get(`/api/models/${modelId}/modelDetail`);
        setModel(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch model details"
        );
      } finally {
>>>>>>> Stashed changes
        setLoading(false);
      }
    };

    fetchModelDetail();
  }, [modelId]);

<<<<<<< Updated upstream
  /*
=======
  // Fetch Like Status
>>>>>>> Stashed changes
  useEffect(() => {
    const fetchModelSavedStatus = async () => {
      if (userId !== null) {
        try {
          const response = await fetch(
            `http://localhost:8000/saveModelsApi/saveCheck/${modelId}/${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch save details");
          }
          const data = await response.json();
          setIsSaved(data.saved);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchModelSavedStatus();
  }, [modelId, userId]);
useEffect(() => {
  const fetchModelLike = async () => {
    if (userId !== null) {
      try {
        const response = await fetch(
          `http://localhost:8000/likeApi/likeCheck/${modelId}/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch like details");
        }
        const data = await response.json();
        setIsLiked(data.liked);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  fetchModelLike();
}, [modelId, userId]);
*/
  const updateModelBtn = () => {
    nav.push(`/pages/${modelId}/updateModel`);
  };

  const delModelBtn = async () => {
    try {
      // Replace with actual user ID or a variable containing it

      const payload = { user_id: userId, modelId: modelId };

         await axios.delete(
           `/api/models/delete?user_id=${userId}&model_id=${modelId}`
         );

    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };
  /*
const likeBtn = async () => {
  try {
    if (isLiked) {
      await axios.post(
        `/api/models/${modelId}/modelLike`
      );
    } else {
      await axios.post(`/api/models/${modelId}/modelLike`);
    }
    setIsLiked(!isLiked);
  } catch (err) {
    console.error("Failed to update like status", err);
  }
};*/
  useEffect(() => {
    if (userId !== null) {
      // Ensure userId is not null
      console.log(userId, "Check userId in fetchLikeStatus");
      async function fetchLikeStatus() {
        try {
          const response = await axios.get(
            `/api/models/${modelId}/modelLike?user_id=${userId}`
          );
<<<<<<< Updated upstream
          if (!response.ok) {
            throw new Error("Failed to fetch like status");
          }
          const data = await response.json();
          setIsLiked(data.liked);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
=======
          setIsLiked(response.data.liked);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch like status");
>>>>>>> Stashed changes
        }
      };
      fetchLikeStatus();
    }
  }, [modelId, userId]);

  // Fetch Saved Status
  useEffect(() => {
    if (userId) {
      const fetchSavedStatus = async () => {
        try {
          const response = await axios.get(
            `/api/models/${modelId}/saveModel?user_id=${userId}`
          );
<<<<<<< Updated upstream
          if (!response.ok) {
            throw new Error("Failed to fetch saved status");
          }
          const data = await response.json();
          setIsSaved(data.saved);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
=======
          setIsSaved(response.data.saved);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch saved status");
>>>>>>> Stashed changes
        }
      };
      fetchSavedStatus();
    }
  }, [modelId, userId]);

  // Handle Like/Unlike
  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.delete(
          `/api/models/${modelId}/modelUnlike?user_id=${userId}`
        );
      } else {
<<<<<<< Updated upstream
        await axios.post(`/api/models/${modelId}/modelLike`, payload);
=======
        await axios.post(`/api/models/${modelId}/modelLike`, { user_id: userId });
>>>>>>> Stashed changes
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to update like status", err);
      setError("Unable to update like status. Please try again.");
    }
  };
<<<<<<< Updated upstream
  const saveBtn = async () => {
=======

  // Handle Save/Unsave
  const handleSave = async () => {
>>>>>>> Stashed changes
    try {
      if (isSaved) {
        await axios.delete(
          `/api/models/${modelId}/unsaveModel?user_id=${userId}`
        );
      } else {
<<<<<<< Updated upstream
        await axios.post(`/api/models/${modelId}/saveModel`, payload);
=======
        await axios.post(`/api/models/${modelId}/saveModel`, { user_id: userId });
>>>>>>> Stashed changes
      }
      setIsSaved(!isSaved);
    } catch (err) {
<<<<<<< Updated upstream
      console.error("Failed to update like status", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
=======
      console.error("Failed to update save status", err);
      setError("Unable to update save status. Please try again.");
    }
  };

  // Handle Update Model
  const handleUpdateModel = () => {
    router.push(`/models/${modelId}/updateModel`);
  };

  // Handle Delete Model
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
      router.push("/models");
    } catch (err) {
      console.error("Failed to delete model", err);
      setError("Unable to delete model. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

>>>>>>> Stashed changes

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  // No Model Found
  if (!model) {
<<<<<<< Updated upstream
    return <div>No model found</div>;
=======
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="warning">No model found.</Alert>
      </div>
    );
>>>>>>> Stashed changes
  }
  const profilePicFilename = model.profile_pic.split("\\").pop();
  const profilePicPath = `/uploads/${profilePicFilename}`;

  return (
<<<<<<< Updated upstream
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{model.user_name}</h1>
            <div className="flex items-center">
              {model.profile_pic && (
                <img
                  src={profilePicPath}
                  alt={model.user_name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <h2 className="text-lg">{model.user_location}</h2>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{model.description}</p>
          <div className="mb-4">
            {model.image && (
              <img
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
=======
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Model Details Card */}
        <Card className="shadow-lg">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 relative h-80 md:h-full">
              {model.image ? (
                <Image
                  src={`/uploads/${model.image}`}
                  alt={model.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                />
              ) : (
                <div className="flex justify-center items-center bg-gray-200 h-full">
                  <Info className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {model.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {/* Like Button */}
                    <Tooltip content={isLiked ? "Unlike" : "Like"}>
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
                    </Tooltip>

                    {/* Save Button */}
                    <Tooltip content={isSaved ? "Unsave" : "Save"}>
                      <Button
                        variant="ghost"
                        onClick={handleSave}
                        aria-label={isSaved ? "Unsave" : "Save"}
                        className="p-2"
                      >
                        {isSaved ? (
                          <SaveFilled className="text-blue-500 w-6 h-6" />
                        ) : (
                          <Save className="w-6 h-6" />
                        )}
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center mb-4">
                  <Avatar className="mr-3">
                    {model.profile_pic ? (
                      <Image
                        src={model.profile_pic}
                        alt={model.user_name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    ) : (
                      <Info className="w-6 h-6 text-gray-500" />
                    )}
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">
                      {model.user_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {model.user_location || "Location Unknown"}
                    </p>
                  </div>
                </div>

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
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Specifications
                  </h2>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>High-quality materials</li>
                    <li>Ergonomic design</li>
                    <li>Durable and long-lasting</li>
                    <li>Available in multiple colors</li>
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Pricing
                  </h2>
                  {model.is_free ? (
                    <Badge variant="success">Free</Badge>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800">
                      ${model.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4">
                {sellerType === "Designer" && model.designer_id === sellerId && (
                  <div className="flex space-x-4">
                    {/* Update Button */}
                    <Tooltip content="Update Model">
                      <Button
                        variant="outline"
                        onClick={handleUpdateModel}
                        className="flex items-center"
                      >
                        <Edit className="w-5 h-5 mr-2" />
                        Update Model
                      </Button>
                    </Tooltip>

                    {/* Delete Button */}
                    <Tooltip content="Delete Model">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteModel}
                        className="flex items-center"
                        disabled={isDeleting}
                      >
                        <Trash className="w-5 h-5 mr-2" />
                        {isDeleting ? "Deleting..." : "Delete Model"}
                      </Button>
                    </Tooltip>
                  </div>
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
              Be the first to review this model. Share your experience and
              help others make informed decisions.
            </p>
            <Button variant="primary" className="mt-4">
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
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src="/uploads/sample-model.jpg"
                    alt="Related Model"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Sample Model 1
                  </p>
                  <p className="text-sm text-gray-500">$49.99</p>
                </div>
              </div>

              {/* Add more related models as needed */}
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <Image
                    src="/uploads/sample-model2.jpg"
                    alt="Related Model"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Sample Model 2
                  </p>
                  <p className="text-sm text-gray-500">$59.99</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* User Interaction Section */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Share Your Thoughts
            </h2>
            <Textarea
              placeholder="Write a comment..."
              className="mb-4"
              disabled
            />
            <Button variant="primary" disabled>
              Submit
            </Button>
            {/* Note: The Textarea and Button are disabled as placeholders.
                Implement the functionality as needed. */}
          </Card>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default ModelPage;
