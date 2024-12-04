"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
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
  const [model, setModel] = useState<PrintedModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  const handleAddToCart = () => {
    if (model) {
      addToCart(model);
      setIsCartOpen(true);
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
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-[600px] w-full md:w-1/2" />
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-destructive">Model not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8 relative">
        <div className="w-full md:w-1/2 relative">
          {model.image ? (
            <Image
              src={`/uploads/printedModels/${model.image}`}
              alt={model.name}
              width={800}
              height={600}
              className="object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <Badge className="absolute top-4 right-4 text-lg px-3 py-1">
            ${model.price ? model.price.toFixed(2) : "N/A"}
          </Badge>
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-primary">{model.name}</h1>
          <p className="text-lg text-muted-foreground">{model.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Material
              </h3>
              <p className="text-lg font-semibold">{model.material}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Color
              </h3>
              <p className="text-lg font-semibold">{model.color}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Resolution
              </h3>
              <p className="text-lg font-semibold">{model.resolution}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Resistance
              </h3>
              <p className="text-lg font-semibold">{model.resistance}%</p>
            </div>
          </div>
          {model.dimensions && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Dimensions (L x W x H)
              </h3>
              <p className="text-lg font-semibold">
                {model.dimensions.length} x {model.dimensions.width} x{" "}
                {model.dimensions.height} cm
              </p>
            </div>
          )}
          {model.weight && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Weight
              </h3>
              <p className="text-lg font-semibold">{model.weight} g</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Status
            </h3>
            <Badge
              variant={model.status === "available" ? "default" : "destructive"}
              className="text-lg px-3 py-1 mt-1"
            >
              {model.status}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Seller
            </h3>
            <p className="text-lg font-semibold">{model.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {model.printer_owner?.bio}
            </p>
            {model.printer_owner?.ratings && (
              <div className="flex items-center mt-1">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">
                  {model.printer_owner.ratings.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <Button className="w-full text-lg py-6" onClick={() => {}}>
            Contact Seller
          </Button>
          <Button className="" onClick={handleAddToCart}>
            <PlusCircle className="w-8 h-8" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintedModelDetailPage;
