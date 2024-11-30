// pages/scrapedModels.tsx
"use client"
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface ScrapedModel {
  id: number;
  name: string;
  description: string;
  file_path: string;
  image_url: string;
  price: number | null;
  download_link: string | null;
}

const ScrapedModelsPage: React.FC = () => {
  const [models, setModels] = useState<ScrapedModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/scrapedModels");
        if (!response.ok) throw new Error("Failed to load models");

        const data = await response.json();
        setModels(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Scraped Models
      </h1>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {models.map((model) => (
            <Card key={model.id} className="shadow-lg rounded-lg">
              <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
                {model.image_url ? (
                  <Image
                    src={model.image_url}
                    alt={model.name}
                    layout="fill"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {model.name}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {model.description || "No description available."}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">
                    {model.price ? `$${model.price}` : "FREE"}
                  </Badge>
                  {model.download_link && (
                    <Link href={model.download_link} target="_blank">
                      <Button size="sm" className="mt-2">
                        Download
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScrapedModelsPage;
