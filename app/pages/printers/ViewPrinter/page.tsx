
/*
"use client";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { data: printers, error } = useSWR(
    "/api/printers/getPrinters",
    fetcher
  );
  const router = useRouter();

  if (error) return <div>Error loading printers</div>;
  if (!printers) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Latest Printers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {printers.map((printer) => (
          <div
            key={printer.printer_id}
            onClick={() =>
              router.push(
                `/pages/printers/${printer.printer_id}/Printer_Detail`
              )
            }
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
          >
            <p>{printer.name}</p>
            <p>{printer.price}</p>
            {printer.image && (
              <img
                src={`/uploads/${printer.image}`} // Ensure this path matches the actual path to the image in the public folder
                alt={printer.name}
                className="w-full h-auto"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;



*/



// pages/printers/index.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import FilterForm from "@/app/componets/searchPrinters/FilterForm";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/app/componets/searchPrinters/Pagination";

interface Printer {
  printer_id: number;
  location: string;
  name: string;
  printer_type: string;
  materials: string[];
  price: number;
  image: string;
  colors: string[];
  services: string[];
  rating?: number;
  Printer_Owners?: {
    // Define fields from Printer_Owners if needed
    owner_id: number;
    // Add other fields as necessary
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PrintersListPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });
  const [initialFilters, setInitialFilters] = useState({
    location: "",
    printer_type: "",
    minPrice: 0,
    maxPrice: 0,
    materials: "",
    sortBy: "",
  });

  // Extract search parameters from URL
  useEffect(() => {
    const params = {
      location: searchParams.get("location") || "",
      printer_type: searchParams.get("printer_type") || "",
      minPrice: parseFloat(searchParams.get("minPrice") || "0"),
      maxPrice: parseFloat(searchParams.get("maxPrice") || "0"),
      materials: searchParams.get("materials") || "",
      sortBy: searchParams.get("sortBy") || "",
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "6", 10),
    };
    setInitialFilters({
      location: params.location,
      printer_type: params.printer_type,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      materials: params.materials,
      sortBy: params.sortBy,
    });

    const fetchPrinters = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (params.location) queryParams.append("location", params.location);
        if (params.printer_type) queryParams.append("printer_type", params.printer_type);
        if (params.minPrice > 0) queryParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice > 0) queryParams.append("maxPrice", params.maxPrice.toString());
        if (params.materials) queryParams.append("materials", params.materials);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        queryParams.append("page", params.page.toString());
        queryParams.append("limit", params.limit.toString());

        const response = await fetch(`/api/search/searchPrinters?${queryParams.toString()}`);

        if (!response.ok) {
          if (response.status === 404) {
            setPrinters([]);
            setPagination({
              total: 0,
              page: params.page,
              limit: params.limit,
              totalPages: 0,
            });
          } else {
            throw new Error("Failed to fetch printers");
          }
        } else {
          const data = await response.json();
          setPrinters(data.printers);
          setPagination(data.pagination);
          setError("");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load printers");
        setPrinters([]);
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

    fetchPrinters();
  }, [searchParams]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const queryParams = new URLSearchParams();

    if (initialFilters.location) queryParams.append("location", initialFilters.location);
    if (initialFilters.printer_type) queryParams.append("printer_type", initialFilters.printer_type);
    if (initialFilters.minPrice > 0) queryParams.append("minPrice", initialFilters.minPrice.toString());
    if (initialFilters.maxPrice > 0) queryParams.append("maxPrice", initialFilters.maxPrice.toString());
    if (initialFilters.materials) queryParams.append("materials", initialFilters.materials);
    if (initialFilters.sortBy) queryParams.append("sortBy", initialFilters.sortBy);

    // Set the new page and limit
    queryParams.append("page", newPage.toString());
    queryParams.append("limit", pagination.limit.toString());

    // Update the URL with new query parameters
    router.push(`/pages/printers/ViewPrinter?${queryParams.toString()}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-12 px-6">
        {/* Filter Form */}
        <FilterForm initialFilters={initialFilters} />

        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Printers
        </h2>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : printers.length > 0 ? (
          <>
            {/* Printers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {printers.map((printer) => (
                <Card
                  key={printer.printer_id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {/* Printer Image */}
                  {printer.image ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={`/uploads/${printer.image}`}
                        alt={printer.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 w-full bg-gray-200 rounded-t-lg">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}

                  {/* Printer Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {printer.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{printer.printer_type}</p>
                    <div className="flex items-center space-x-3 mb-3">
                      {printer.materials &&
                        printer.materials.map((material, index) => (
                          <Badge key={index} variant="secondary">
                            {material}
                          </Badge>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-green-500">
                        ${printer.price}
                      </span>
                      <Link href={`/pages/printers/${printer.printer_id}/Printer_Detail`} passHref>
                        <Button
                          variant="outline"
                          className="bg-gray-700 text-white hover:bg-green-700 transition-colors duration-300"
                        >
                          View Printer
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
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
            No printers found. Try adjusting your search criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrintersListPage;
