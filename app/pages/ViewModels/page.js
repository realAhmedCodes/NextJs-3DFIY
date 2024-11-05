// pages/models/index.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";




import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const ModelsPage = () => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [models, setModels] = useState([]);
  const router = useRouter();

  // Get user information from Redux store (if needed)
  const { userId } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/models/getModel");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const modelsData = await response.json();

        if (Array.isArray(modelsData)) {
          setModels(modelsData);
        } else if (modelsData) {
          setModels([modelsData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load models. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModelClick = (modelId) => {
    router.push(`/pages/${modelId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
     
      <div className="max-w-7xl mx-auto p-4">
        
        <h1 className="text-3xl font-bold text-center my-8">Latest Models</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card
                key={model.model_id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleModelClick(model.model_id)}
              >
                {model.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={`/uploads/${model.image}`}
                      alt={model.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{model.name}</h2>
                  <p className="text-gray-600 mb-2">{model.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {model.tags &&
                        model.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <p className="text-lg font-bold text-green-500">
                      {model.is_free ? "Free" : `$${model.price}`}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsPage;
