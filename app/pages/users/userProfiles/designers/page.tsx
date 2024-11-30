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
import { Loader2 } from "lucide-react";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Designer {
  designer_id: number;
  user_id: number;
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
    if (pagination.page) queryParams.append("page", newPage.toString());

    router.push(`/pages/users/userProfiles/designers?${queryParams.toString()}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
console.log(designers)
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        {/* Filter Section */}
        <DesignerFilterForm initialFilters={initialFilters} />

        {/* Page Title */}
        <h1 className="text-5xl mt-4 font-extrabold text-center text-gray-800 mb-10">
          Find Top Designers
        </h1>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : designers.length > 0 ? (
          <>
            {/* Designers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {designers.map((designer) => {
                const { Users, cnic_number, bio, ratings } = designer;
               const profilePicPath = Users.profile_pic
                 ? `${Users.profile_pic}` 
                 : null;

                return (
                  <Card
                    key={designer.designer_id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Profile Picture */}
                    <div className="flex justify-center mt-6">
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
                          <span className="text-gray-600">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Designer Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-2xl font-semibold text-gray-800 text-center capitalize">
                        {Users.name}
                      </h2>
                      <p className="text-gray-500 text-sm text-center">
                        @{Users.username}
                      </p>
                      <p className="text-gray-700 mt-2 font-semibold text-center capitalize">
                        {Users.location}
                      </p>
                      <p className="text-gray-600 mt-2 text-center text-sm flex-1">
                        {bio.length > 100 ? `${bio.substring(0, 100)}...` : bio}
                      </p>
                    </div>

                    {ratings !== null && (
                      <div className="flex items-center justify-center -mt-4 mb-8">
                        {[...Array(ratings)].map((_, index) => (
                          <svg
                            key={`filled-${index}`}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-600 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.611 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                        ))}

                        {[...Array(5 - ratings)].map((_, index) => (
                          <svg
                            key={`outlined-${index}`}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300 mr-1"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.611 9.397c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.97z" />
                          </svg>
                        ))}

                      </div>
                    )}

                    <div className="m-6 -mt-4 rounded-b-xl">
                      <Link href={`/pages/users/${designer.user_id}/profile`}>
                        <Button className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
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
            No designers found. Try adjusting your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default DesignersPage;
