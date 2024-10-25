"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/componets/Navbar";
import ModelSearch from "@/app/componets/search/ModelSearch";

export default function Page() {
  const [models, setModels] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/models/getModel");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const modelsData = await response.json();
        console.log(modelsData);

        if (Array.isArray(modelsData)) {
          setModels(modelsData);
        } else if (modelsData) {
          setModels([modelsData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <ModelSearch></ModelSearch>
        <h1 className="text-3xl font-bold text-center mb-8">Latest Models</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.model_id}
              onClick={() => router.push(`/pages/${model.model_id}`)}
              className="bg-white border rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition duration-300"
            >
              {model.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={`/uploads/${model.image}`}
                    alt={model.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{model.name}</h2>
                <p className="text-lg font-bold text-green-500">
                  ${model.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
