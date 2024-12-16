"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import FilterForm from "@/app/componets/searchPrinters/FilterForm";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/app/componets/searchPrinters/Pagination";
import { Printer, Tag, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

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
  console.log(printers);
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
        if (params.printer_type)
          queryParams.append("printer_type", params.printer_type);
        if (params.minPrice > 0)
          queryParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice > 0)
          queryParams.append("maxPrice", params.maxPrice.toString());
        if (params.materials) queryParams.append("materials", params.materials);
        if (params.sortBy) queryParams.append("sortBy", params.sortBy);
        queryParams.append("page", params.page.toString());
        queryParams.append("limit", params.limit.toString());

        const response = await fetch(
          `/api/search/searchPrinters?${queryParams.toString()}`
        );

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
        toast.error(err.message || "Failed to load printers");
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

    if (initialFilters.location)
      queryParams.append("location", initialFilters.location);
    if (initialFilters.printer_type)
      queryParams.append("printer_type", initialFilters.printer_type);
    if (initialFilters.minPrice > 0)
      queryParams.append("minPrice", initialFilters.minPrice.toString());
    if (initialFilters.maxPrice > 0)
      queryParams.append("maxPrice", initialFilters.maxPrice.toString());
    if (initialFilters.materials)
      queryParams.append("materials", initialFilters.materials);
    if (initialFilters.sortBy)
      queryParams.append("sortBy", initialFilters.sortBy);

    // Set the new page and limit
    queryParams.append("page", newPage.toString());
    queryParams.append("limit", pagination.limit.toString());

    // Update the URL with new query parameters
    router.push(`/pages/printers/ViewPrinter?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container gap-12 mx-auto ">
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
                  className="flex overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                  key={printer.printer_id}
                >
                  <div className="flex flex-col flex-grow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4"> 
                        <div>
                          <h3 className="text-2xl font-bold text-primary">
                            {printer.name}
                          </h3>
                          <p className="text-muted-foreground flex items-center mt-1">
                            <Printer className="w-4 h-4 mr-2" />
                            {printer.printer_type}
                          </p>
                        </div>
                        {printer.image ? (
                          <div className="relative h-20 w-20 rounded-md overflow-hidden">
                            <Image
                              src={"/uploads/" + printer.image}
                              alt={printer.name}
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-20 w-20 bg-secondary rounded-md">
                            <Printer className="w-8 h-8 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                      <Separator className="my-4" />
                      <div className="flex items-center space-x-2 mb-4">
                        <Tag className="w-4 h-4 text-primary" />
                        <div className="flex flex-wrap gap-2">
                          {printer.materials?.map((material, index) => (
                            <Badge key={index} variant="secondary">
                              {material}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center text-2xl font-bold text-primary">
                        $ {printer.price.toFixed(2)}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 mt-auto">
                      <Link
                        href={`/pages/printers/${printer.printer_id}/Printer_Detail`}
                        passHref
                        className="w-full"
                      >
                        <Button className="w-full" variant="default">
                          View Printer Details
                        </Button>
                      </Link>
                    </CardFooter>
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
