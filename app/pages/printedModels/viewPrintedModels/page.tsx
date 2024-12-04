"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type PrintedModel = {
  printed_model_id: number;
  user_id: number | null;
  printer_owner_id: number | null;
  quantity: number | null;
  name: string;
  description: string;
  material: string;
  color: string;
  resolution: string;
  resistance: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  } | null;
  weight: number | null;
  image: string | null;
  status: string;
  price: number | null;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    username: string;
    email: string;
  } | null;
  printer_owner: {
    bio: string;
    ratings: number | null;
  } | null;
};

const PrintedModelsPage = () => {
  const [printedModels, setPrintedModels] = useState<PrintedModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrintedModels = async () => {
      try {
        const response = await fetch("/api/printedModels/printedModels", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data: PrintedModel[] = await response.json();
          setPrintedModels(data);
        } else {
          console.error("Failed to fetch printed models");
          // Handle error as needed
        }
      } catch (error) {
        console.error("Error fetching printed models:", error);
        // Handle error as needed
      } finally {
        setLoading(false);
      }
    };

    fetchPrintedModels();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Printed 3D Models</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      ) : printedModels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {printedModels.map((model) => (
            <Card key={model.printed_model_id} className="flex flex-col">
              {/* Image Section */}
              <CardHeader>
                {model.image ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={`/uploads/printedModels/${model.image}`}
                      alt={model.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </CardHeader>

              {/* Model Information */}
              <CardContent className="p-4 flex flex-col space-y-3">
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {model.name}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {model.description || "No description available."}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between text-lg font-medium text-gray-900">
                  <div>Price:</div>
                  <div className="text-xl font-bold">
                    ${model.price ? model.price.toFixed(2) : "N/A"}
                  </div>
                </div>

                {/* Material, Color, Resolution, Resistance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Material:</span>
                    <span className="font-medium">
                      {model.material || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Color:</span>
                    <span className="font-medium">{model.color || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Resolution:</span>
                    <span className="font-medium">
                      {model.resolution || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Resistance:</span>
                    <span className="font-medium">
                      {model.resistance || "N/A"}%
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* View Details Button */}
              <div className="px-4 pb-4 mt-auto">
                <Link
                  href={`/pages/printedModels/${model.printed_model_id}/detail`}
                >
                  <Button className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>No printed models found.</p>
      )}
    </div>
  );
};

export default PrintedModelsPage;
