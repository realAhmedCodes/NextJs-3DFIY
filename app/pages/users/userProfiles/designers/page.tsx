// pages/designers/index.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesignerFilterForm from "@/app/componets/searchDesigners/FilterForm";
import Pagination from "@/app/componets/searchDesigners/Pagination";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Designer {
  designer_id: number;
  Users: {
    name: string;
    username: string;
    location: string;
    profile_pic: string | null;
    phoneNo: string;
  };
  cnic_number: string;
  bio: string;
  ratings: number | null;
}

const DesignersPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });

  const [initialFilters, setInitialFilters] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    const params = {
      name: searchParams.get("name") || "",
      location: searchParams.get("location") || "",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "6", 10),
      sortBy: searchParams.get("sortBy") || "",
    };

    setInitialFilters({
      name: params.name,
      location: params.location,
    });

    const fetchDesigners = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (params.name) queryParams.append("name", params.name);
        if (params.location) queryParams.append("location", params.location);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        queryParams.append("page", params.page.toString());
        queryParams.append("limit", params.limit.toString());

        const response = await fetch(
          `/api/search/searchDesigner?${queryParams.toString()}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setDesigners([]);
            setPagination({
              total: 0,
              page: params.page,
              limit: params.limit,
              totalPages: 0,
            });
          } else {
            throw new Error("Failed to fetch designers");
          }
        } else {
          const data = await response.json();
          setDesigners(data.designers);
          setPagination(data.pagination);
          setError("");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load designers");
        setDesigners([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 6,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDesigners();
  }, [searchParams]);

 
  const handlePageChange = (newPage: number) => {
  
    const queryParams = new URLSearchParams();

    if (initialFilters.name) queryParams.append("name", initialFilters.name);
    if (initialFilters.location)
      queryParams.append("location", initialFilters.location);
    if (pagination.limit)
      queryParams.append("limit", pagination.limit.toString());

   
    queryParams.append("page", newPage.toString());

   
    router.push(
      `/pages/users/userProfiles/designers?${queryParams.toString()}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-autom m-20">
       
        <DesignerFilterForm initialFilters={initialFilters} />

        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Designers
        </h1>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : designers.length > 0 ? (
          <>
            {/* Designers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {designers.map((designer) => {
                const { Users, cnic_number, bio, ratings } = designer;
                const profilePicPath = Users.profile_pic
                  ? `/uploads/${Users.profile_pic}`
                  : null;

                return (
                  <Card
                    key={designer.designer_id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Profile Picture */}
                    <div className="flex justify-center mt-4">
                      {profilePicPath ? (
                        <div className="w-24 h-24 relative">
                          <Image
                            src={profilePicPath}
                            alt={Users.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Designer Info */}
                    <div className="p-4 text-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {Users.name}
                      </h2>
                      <p className="text-gray-600">@{Users.username}</p>
                      <p className="text-gray-700 mt-2">
                        Location: {Users.location}
                      </p>
                      <p className="text-gray-700 mt-2">
                        Phone: {Users.phoneNo}
                      </p>
                      <p className="text-gray-600 mt-2">{bio}</p>
                      {ratings !== null && (
                        <p className="text-yellow-500 mt-2">
                          ⭐ {ratings} Ratings
                        </p>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <div className="bg-gray-100 p-4 rounded-b-xl">
                      <Link
                        href={`/pages/users/${designer.designer_id}/profile`}
                        passHref
                      >
                        <Button
                          variant="outline"
                          className="bg-blue-500 text-white py-2 px-4 rounded-full shadow-sm hover:bg-blue-600 transition"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Component */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p className="text-center text-xl text-gray-600">
            No designers found. Try adjusting your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignersPage;
