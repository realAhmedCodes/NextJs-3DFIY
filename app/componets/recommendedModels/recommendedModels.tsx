import React, { useMemo } from "react";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

const RecommendedModels = () => {
  const { userId } = useSelector((state: any) => state.user);

  const showRecommended = useMemo(() => !!userId, [userId]);

  const {
    data: recommendedData,
    error: recommendedError,
    isLoading: recommendedLoading,
  } = useSWR(
    showRecommended
      ? `http://localhost:8000/recommendations/models/${userId}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const recommendedModels: Model[] = recommendedData?.recommendations || [];
  const errorRecommended: string = recommendedError?.message || "";
  const loadingRecommended: boolean = recommendedLoading;

  return (
    <div>
      {/* Recommended Models Section */}
      {showRecommended && (
        <>
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
            Recommended Models
          </h1>

          {/* Error Message for Recommended Models */}
          {errorRecommended && (
            <Alert variant="destructive" className="mb-6">
              {errorRecommended}
            </Alert>
          )}

          {/* Recommended Models Loading State */}
          {loadingRecommended ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-xl" />
              ))}
            </div>
          ) : recommendedModels.length > 0 ? (
            // Recommended Models Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedModels.map((model) => (
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
                        src={
                          model.isScraped
                            ? `${model.image}`
                            : `/uploads/${model.image}`
                        }
                        alt={model.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 w-full bg-gray-200 rounded-t-lg">
                      <span className="text-gray-500">No Image Available</span>
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
          ) : (
            <p className="text-center text-2xl text-gray-600 mt-10">
              No recommended models found.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendedModels;
