// /app/components/sales/recentReviews/RecentDesignerReviews.tsx

"use client";

import React from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface Review {
  id: number;
  reviewText: string;
  createdAt: string;
  reviewer: {
    name: string;
    email: string;
    profilePic: string;
  };
}

interface RecentDesignerReviewsProps {
  designerId: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const RecentDesignerReviews: React.FC<RecentDesignerReviewsProps> = ({
  designerId,
}) => {
  const { data, error, isLoading } = useSWR(
    `/api/reviews/getDesignersReviews/${designerId}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4">
            <CardHeader className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load reviews.</p>;
  }

  if (!data || data.reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {data.reviews.map((review: Review) => (
        <Card key={review.id} className="p-4">
          <CardHeader className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={review.reviewer.profilePic}
                alt={review.reviewer.name}
              />
              <AvatarFallback>
                {review.reviewer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{review.reviewer.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {new Date(review.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">{review.reviewText}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentDesignerReviews;
