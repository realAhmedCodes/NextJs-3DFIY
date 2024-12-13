// /components/RecentModelOrderPayments.jsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

const RecentModelOrderPayments = ({ designerId }) => {
  const [purchasesData, setPurchasesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent model order payments data
    const fetchRecentPurchases = async () => {
      try {
        const response = await axios.get(
          `/api/${designerId}/recentCustomModelPayments`
        );
        setPurchasesData(response.data);
      } catch (error) {
        console.error("Error fetching recent model order payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (designerId) {
      fetchRecentPurchases();
    }
  }, [designerId]);

  if (loading) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Recent Model Order Payments</CardTitle>
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!purchasesData) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Recent Model Order Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to load recent purchases data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-2">
      <CardHeader>
        <CardTitle>Recent Model Order Payments</CardTitle>
       
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {purchasesData.recentPurchases.map((purchase, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white shadow rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      purchase.buyerProfilePic.startsWith("http")
                        ? purchase.buyerProfilePic
                        : `/uploads/${purchase.buyerProfilePic}`
                    }
                    alt={purchase.buyerName}
                  />
                  <AvatarFallback>
                    {purchase.buyerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {purchase.buyerName}
                  </p>
                  <p className="text-sm text-gray-500">{purchase.buyerEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-900">
                <CurrencyDollarIcon className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  +${purchase.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentModelOrderPayments;
