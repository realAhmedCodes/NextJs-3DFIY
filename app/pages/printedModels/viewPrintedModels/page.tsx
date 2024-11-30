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
            <Card key={model.printed_model_id} className="shadow-md">
              <CardHeader>
                {model.image ? (
                  <Image
                    src={`/uploads/printedModels/${model.image}`}
                    alt={model.name}
                    width={400}
                    height={300}
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl font-semibold">
                  {model.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{model.description}</p>
                <div className="mt-2">
                  <span className="font-medium">Price: </span>
                  <span>${model.price ? model.price.toFixed(2) : "N/A"}</span>
                </div>
                <div className="mt-1">
                  <span className="font-medium">Material: </span>
                  <span>{model.material}</span>
                </div>
                <div className="mt-1">
                  <span className="font-medium">Color: </span>
                  <span>{model.color}</span>
                </div>
                <div className="mt-1">
                  <span className="font-medium">Resolution: </span>
                  <span>{model.resolution}</span>
                </div>
                <div className="mt-1">
                  <span className="font-medium">Resistance: </span>
                  <span>{model.resistance}%</span>
                </div>
              </CardContent>
              <div className="px-4 pb-4">
                <Link
                  href={`/pages/printedModels/${model.printed_model_id}/detail`}
                >
                  <Button variant="primary" className="w-full">
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
