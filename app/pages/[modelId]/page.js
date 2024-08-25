"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode correctly
import axios from "axios";
import { useParams } from "next/navigation";

const page = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkToken, setCheckToken] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [isLiked, setIsLiked] = useState(null);
  const [isSaved, setIsSaved] = useState(null);
  const [userId, setUserId] = useState(null);


  const nav= useRouter()
  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      setCheckToken(token);
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
        setSellerType(decodedToken.sellerType);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  console.log(userId, sellerType);

  useEffect(() => {
    const fetchModelDetail = async () => {
      console.log(modelId, "seen");
      try {
        const response = await fetch(`/api/models/${modelId}/modelDetail`);
        if (!response.ok) {
          throw new Error("Failed to fetch model details");
        }
        const data = await response.json();
        setModel(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModelDetail();
  }, [modelId]);

  /*
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
          const response = await fetch(
            `/api/models/${modelId}/modelLike?user_id=${userId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setIsLiked(data.liked);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
      fetchLikeStatus();
    }
  }, [modelId, userId]); // Ensure userId is in the dependency array
  console.log(isLiked);

  useEffect(() => {
    if (userId !== null) {
      // Ensure userId is not null
      console.log(userId, "Check userId in fetchSavedStatus");
      async function fetchSavedStatus() {
        try {
          const response = await fetch(
            `/api/models/${modelId}/saveModel?user_id=${userId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setIsSaved(data.saved);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
      fetchSavedStatus();
    }
  }, [modelId, userId]); // Ensure userId is in the dependency array
  console.log(isLiked);

  const likeBtn = async () => {
    try {
      // Replace with actual user ID or a variable containing it

      const payload = { user_id: userId };

      if (isLiked) {
        await axios.delete(
          `/api/models/${modelId}/modelUnlike?user_id=${userId}`
        );
      } else {
        await axios.post(`/api/models/${modelId}/modelLike`, payload);
      }

      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };
  const saveBtn = async () => {
    try {
      // Replace with actual user ID or a variable containing it

      const payload = { user_id: userId };

      if (isSaved) {
        await axios.delete(
          `/api/models/${modelId}/unsaveModel?user_id=${userId}`
        );
      } else {
        await axios.post(`/api/models/${modelId}/saveModel`, payload);
      }

      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!model) {
    return <div>No model found</div>;
  }
  const profilePicFilename = model.profile_pic.split("\\").pop();
  const profilePicPath = `/uploads/${profilePicFilename}`;

  return (
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
                className="w-full h-auto"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            {!model.isFree && (
              <h3 className="text-xl font-bold">{model.price}</h3>
            )}
            <div>
              <button onClick={saveBtn}>
                {isSaved ? "Unsave Model" : "Save Model"}
              </button>
            </div>
            {sellerType === "Designer" && (
              <div>
                <button onClick={updateModelBtn}>Update Model</button>
                <button onClick={delModelBtn}>Delete Model</button>
              </div>
            )}
            <div>
              <button onClick={likeBtn}>
                {isLiked ? "Remove Like" : "Like"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
