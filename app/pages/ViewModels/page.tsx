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
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import StarOutlineIcon from "@heroicons/react/24/outline/StarIcon";

interface Model {
  model_id: number;
  name: string;
  description: string;
  price: number | null;
  is_free: boolean;
  image: string;
  tags: string[];
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
  });

  // Extract search parameters from URL
  useEffect(() => {
    const params = {
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      minPrice: parseFloat(searchParams.get("minPrice") || "0"),
      maxPrice: parseFloat(searchParams.get("maxPrice") || "0"),
      tags: searchParams.get("tags") || "",
      sortBy: searchParams.get("sortBy") || "",
      modelIds: searchParams.get("modelIds") || null,
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
    });

    const fetchModels = async () => {
      setLoading(true);
      setError("");

      try {
        let fetchedModels: Model[] = [];
        let total = 0;
        let totalPages = 0;

        if (params.modelIds) {
          // Image-based search: Fetch models based on modelIds
          const modelIdArray = params.modelIds
            .split(",")
            .map((id) => parseInt(id.trim(), 10));
          const queryParams = new URLSearchParams({
            modelIds: params.modelIds,
            page: params.page.toString(),
            limit: params.limit.toString(),
          }).toString();
          const response = await fetch(
            `/api/search/searchModels?${queryParams}`,
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
          fetchedModels = data.models;
          total = data.pagination.total;
          totalPages = data.pagination.totalPages;
        } else {
          // Filter-based search
          const queryParams: Record<string, string> = {};

          if (params.keyword) queryParams.keyword = params.keyword;
          if (params.category) queryParams.category = params.category;
          if (params.minPrice > 0)
            queryParams.minPrice = params.minPrice.toString();
          if (params.maxPrice > 0)
            queryParams.maxPrice = params.maxPrice.toString();
          if (params.tags) queryParams.tags = params.tags;
          if (params.sortBy) queryParams.sortBy = params.sortBy;
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
          fetchedModels = data.models;
          total = data.pagination.total;
          totalPages = data.pagination.totalPages;
        }

        setModels(fetchedModels);
        setPagination({
          total,
          page: params.page,
          limit: params.limit,
          totalPages,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load models");
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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const queryParams = new URLSearchParams();

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

    // Check if modelIds exist for image-based search
    const modelIds = searchParams.get("modelIds");
    if (modelIds) {
      queryParams.append("modelIds", modelIds);
    }

    // Set the new page and limit
    queryParams.append("page", newPage.toString());
    queryParams.append("limit", pagination.limit.toString());

    // Update the URL with new query parameters
    router.push(`/models?${queryParams.toString()}`);
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
          {/* Page Title */}

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
                    className="bg-white  md:flex-row rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex lg:flex-col"
                  >
                    <div className="absolute z-10 m-6 mt-4 shadow-xl">
                      <Badge className="text-sm">
                        {model.is_free ? "FREE" : `$${model.price}`}
                      </Badge>
                    </div>
                    {/* Model Image */}
                    {model.image ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={`/uploads/${model.image}`}
                          alt={model.name}
                          fill
                          className="object-cover rounded-t-xl"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48 w-full bg-gray-200 rounded-t-xl">
                        <span className="text-gray-500">
                          No Image Available
                        </span>
                      </div>
                    )}
                    <div>
                      {/* Model Info */}
                      <div className="px-6 flex flex-col">
                        <div className="flex mt-4 justify-between items-center">
                          <h2 className="lg:line-clamp-2  font-semibold text-gray-800 capitalize">
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

                      <div className="m-6 mt-3 rounded-b-xl">
                        <Link href={`/pages/${model.model_id}`}>
                          <Button className="w-full">View Model</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination Component */}
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
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





