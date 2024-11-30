// pages/search-models/index.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import SearchBar from "./SearchBar";

interface Model {
  model_id: number;
  name: string;
  description: string;
  price: number;
  is_free: boolean;
  image: string;
  tags: string[];
}

const SearchModelsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Read query params
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Extract search parameters from URL
  const getSearchParams = () => {
    return {
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      tags: searchParams.get("tags") || "",
      sortBy: searchParams.get("sortBy") || "",
    };
  };

  const currentSearchParams = getSearchParams();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Model[]>("/api/search/searchModels", {
          params: currentSearchParams,
        });
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  const handleModelClick = (modelId: number) => {
    router.push(`/pages/${modelId}`); 
  };

  return (
    <div className="bg-gray-50 min-h-screen">
     
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-8">Search Results</h1>

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
        ) : models.length > 0 ? (
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
                      fill
                      className="object-cover rounded-t-lg"
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
        ) : (
          <p className="text-center text-gray-500">No models found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchModelsPage;
