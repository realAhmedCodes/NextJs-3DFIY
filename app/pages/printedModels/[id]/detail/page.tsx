"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";


type PrintedModelDetail = {
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

const PrintedModelDetailPage = () => {
  const params = useParams();
  const modelId = params.id;
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  const handleAddToCart = () => {
    if (model) {
      addToCart(model);
      setIsCartOpen(true); // Open the cart
    } else {
      console.error("Model is null");
    }
  };

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/printedModels/${modelId}/detail`);
        if (response.ok) {
          const data = await response.json();
          setModel(data);
        } else {
          console.error("Failed to fetch the model details");
        }
      } catch (error) {
        console.error("Error fetching model details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [modelId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-96 w-full mb-6" />
        {/* ...other skeletons... */}
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container mx-auto p-4">
        <p>Model not found.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          {model.image ? (
            <Image
              src={`/uploads/printedModels/${model.image}`}
              alt={model.name}
              width={800}
              height={600}
              className="object-cover rounded-md"
            />
          ) : (
            <div className="h-96 bg-gray-200 rounded-md flex items-center justify-center">
              <span>No Image</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <CardTitle className="text-2xl font-bold">{model.name}</CardTitle>
          <p className="mt-2 text-gray-700">{model.description}</p>
          <div className="mt-4">
            <span className="font-medium">Price: </span>
            <span>${model.price ? model.price.toFixed(2) : "N/A"}</span>
          </div>
          <div className="mt-2">
            <span className="font-medium">Material: </span>
            <span>{model.material}</span>
          </div>
          <div className="mt-2">
            <span className="font-medium">Color: </span>
            <span>{model.color}</span>
          </div>
          <div className="mt-2">
            <span className="font-medium">Resolution: </span>
            <span>{model.resolution}</span>
          </div>
          <div className="mt-2">
            <span className="font-medium">Resistance: </span>
            <span>{model.resistance}%</span>
          </div>
          {model.dimensions && (
            <div className="mt-2">
              <span className="font-medium">Dimensions (L x W x H): </span>
              <span>
                {model.dimensions.length} x {model.dimensions.width} x{" "}
                {model.dimensions.height} cm
              </span>
            </div>
          )}
          {model.weight && (
            <div className="mt-2">
              <span className="font-medium">Weight: </span>
              <span>{model.weight} g</span>
            </div>
          )}
          <div className="mt-4">
            <span className="font-medium">Status: </span>
            <span
              className={
                model.status === "available" ? "text-green-600" : "text-red-600"
              }
            >
              {model.status}
            </span>
          </div>
          {/* Add more details as needed */}
        </CardContent>
        <div className="px-4 pb-4">
          <Button className="w-full">
            Contact Seller
          </Button>
        </div>
      </Card>
      <div>
        <div className="px-4 pb-4">
          <Button
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintedModelDetailPage;
