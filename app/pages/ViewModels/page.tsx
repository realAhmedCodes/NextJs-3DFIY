// pages/ViewModels/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import FilterForm from "@/app/componets/searchModels/FilterForm";
import ImageSearchForm from "@/app/componets/searchModels/ImageSearchForm";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/app/componets/searchModels/Pagination";
import { toast } from "sonner";

interface Model {
  model_id: number;
  category_id: number;
  designer_id: number;
  name: string;
  description: string;
  is_free: boolean;
  image: string;
  model_file: string;
  likes_count: number;
  download_count?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  tags: string[];
  price?: number;
  isScraped?: boolean;
  downloadLink?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ModelsListPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  });
  const [initialFilters, setInitialFilters] = useState({
    keyword: "",
    category: "",
    minPrice: 0,
    maxPrice: 0,
    tags: "",
    sortBy: "",
    modelType: "all",
  });

  // Combined useEffect for fetching models
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError("");

      try {
        const modelIdsParam = searchParams.get("modelIds");
        console.log("Model IDs from URL:", modelIdsParam);

        if (modelIdsParam) {
          // Fetch models by IDs
          const modelIds = modelIdsParam
            .split(",")
            .map((id) => parseInt(id.trim()))
            .filter((id) => !isNaN(id));

          if (modelIds.length === 0) {
            toast.error("Invalid model IDs provided.");
            setModels([]);
            setPagination({
              total: 0,
              page: 1,
              limit: 9,
              totalPages: 0,
            });
            setLoading(false);
            return;
          }

          console.log("Fetching models by IDs:", modelIds);

          const response = await fetch("/api/search/getModelsByIds", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ model_ids: modelIds }),
          });

          if (!response.ok) {
            if (response.status === 404) {
              setModels([]);
              setPagination({
                total: 0,
                page: 1,
                limit: 9,
                totalPages: 0,
              });
              toast.error("No models found for the provided IDs.");
              setLoading(false);
              return;
            } else {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch models");
            }
          }

          const data = await response.json();

          // Ensure 'models' is present and is an array
          if (!data.models || !Array.isArray(data.models)) {
            toast.error("Invalid response structure from server.");
            setModels([]);
            setPagination({
              total: 0,
              page: 1,
              limit: 9,
              totalPages: 0,
            });
            setLoading(false);
            return;
          }

          console.log("Models fetched by IDs:", data.models);

          setModels(data.models);
          setPagination({
            total: data.models.length,
            page: 1,
            limit: 9,
            totalPages: Math.ceil(data.models.length / 9),
          });
        } else {
          // No modelIds, fetch models based on search parameters
          const params = {
            keyword: searchParams.get("keyword") || "",
            category: searchParams.get("category") || "",
            minPrice: parseFloat(searchParams.get("minPrice") || "0"),
            maxPrice: parseFloat(searchParams.get("maxPrice") || "0"),
            tags: searchParams.get("tags") || "",
            sortBy: searchParams.get("sortBy") || "",
            modelType: searchParams.get("modelType") || "all",
            page: parseInt(searchParams.get("page") || "1", 10),
            limit: parseInt(searchParams.get("limit") || "9", 10),
          };
          setInitialFilters({
            keyword: params.keyword,
            category: params.category,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            tags: params.tags,
            sortBy: params.sortBy,
            modelType: params.modelType,
          });

          console.log("Fetching models with filters:", params);

          const queryParams: Record<string, string> = {};

          if (params.keyword) queryParams.keyword = params.keyword;
          if (params.category) queryParams.category = params.category;
          if (params.minPrice > 0)
            queryParams.minPrice = params.minPrice.toString();
          if (params.maxPrice > 0)
            queryParams.maxPrice = params.maxPrice.toString();
          if (params.tags) queryParams.tags = params.tags;
          if (params.sortBy) queryParams.sortBy = params.sortBy;
          if (params.modelType && params.modelType !== "all") {
            queryParams.modelType = params.modelType;
          }

          // Set the new page and limit
          queryParams.page = params.page.toString();
          queryParams.limit = params.limit.toString();

          const queryString = new URLSearchParams(queryParams).toString();
          const response = await fetch(
            `/api/search/searchModels?${queryString}`,
            {
              method: "GET",
            }
          );

          if (!response.ok) {
            if (response.status === 404) {
              setModels([]);
              setPagination({
                total: 0,
                page: params.page,
                limit: params.limit,
                totalPages: 0,
              });
              setLoading(false);
              return;
            } else {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch models");
            }
          }

          const data = await response.json();
          console.log("Models fetched with filters:", data.models);

          setModels(data.models);
          setPagination({
            total: data.pagination.total,
            page: data.pagination.page,
            limit: data.pagination.limit,
            totalPages: data.pagination.totalPages,
          });
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to load models");
        setModels([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 9,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [searchParams]);

  console.log("Current Models:", models);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const queryParams = new URLSearchParams();

    const modelIdsParam = searchParams.get("modelIds");
    if (modelIdsParam) {
      queryParams.append("modelIds", modelIdsParam);
    } else {
      // Append other filters if no modelIds
      if (initialFilters.keyword)
        queryParams.append("keyword", initialFilters.keyword);
      if (initialFilters.category)
        queryParams.append("category", initialFilters.category);
      if (initialFilters.minPrice > 0)
        queryParams.append("minPrice", initialFilters.minPrice.toString());
      if (initialFilters.maxPrice > 0)
        queryParams.append("maxPrice", initialFilters.maxPrice.toString());
      if (initialFilters.tags) queryParams.append("tags", initialFilters.tags);
      if (initialFilters.sortBy)
        queryParams.append("sortBy", initialFilters.sortBy);
      if (initialFilters.modelType && initialFilters.modelType !== "all") {
        queryParams.append("modelType", initialFilters.modelType);
      }
    }

    // Set the new page and limit
    queryParams.append("page", newPage.toString());
    queryParams.append("limit", pagination.limit.toString());

    // Update the URL with new query parameters
    router.push(`/pages/ViewModels?${queryParams.toString()}`);
  };

  // Handle Download
  const handleDownload = (model: Model) => {
    if (model.isScraped) {
      window.open(model.downloadLink, "_blank"); // Redirect to external source
    } else {
      // Trigger direct download from your server
      fetch(`/api/download/${model.model_id}`)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${model.name}.zip`; // Adjust file extension as needed
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch((err) => {
          console.error("Download failed:", err);
          alert("Failed to download the model. Please try again later.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container gap-12 mx-auto ">
        <FilterForm initialFilters={initialFilters} />
        <ImageSearchForm />

        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Explore Models
        </h1>

        {/* Filter Section */}
        <div>
          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : models.length > 0 ? (
            <>
              {/* Models Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model) => (
                  <Card
                    key={model.model_id}
                    className="bg-white md:flex-row rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex lg:flex-col relative"
                  >
                    {/* Badge indicating model type */}
                    <div className="absolute z-10 m-6 mt-4 shadow-xl">
                      <Badge className="text-sm">
                        {model.isScraped
                          ? "External Download"
                          : model.is_free
                          ? "FREE"
                          : `$${model.price}`}
                      </Badge>
                    </div>
                    {/* Model Image */}
                    {model.image ? (
                      <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                        <Image
                          src={model.isScraped ? `${model.image}` : `/uploads/${model.image}`}
                          alt={model.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 w-full bg-gray-200 rounded-t-lg">
                        <span className="text-gray-500">
                          No Image Available
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col flex-1">
                      {/* Model Info */}
                      <div className="px-6 flex flex-col flex-1">
                        <div className="flex mt-4 justify-between items-center">
                          <h2 className="lg:line-clamp-2 font-semibold text-gray-800 capitalize">
                            {model.name}
                          </h2>
                        </div>

                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                          {model.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap mt-3 gap-2">
                          {model.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs text-gray-600 font-medium capitalize"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="m-6 mt-4 rounded-b-xl space-y-2">
                        <Link href={`/pages/ModelDetail/${model.model_id}`}>
                          <Button className="w-full">View Model</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Component */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-2xl text-gray-600 mt-10">
              No models found. Try adjusting your search criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelsListPage;
