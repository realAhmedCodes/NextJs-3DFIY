"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Star,
  MessageCircle,
  PrinterIcon as Printer3d,
  Package,
  Ruler,
  PaintBucket,
  Zap,
} from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { useContext } from "react";
import { toast } from "sonner";

type PrintedModelDetail = {
  printed_model_id: number;
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

export default function PrintedModelDetailPage() {
  const params = useParams();
  const modelId = params.id;
  const [model, setModel] = useState<PrintedModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, isCartOpen: openCart } = useContext(CartContext);

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

  const handleAddToCart = () => {
    if (model) {
      addToCart(model);
      toast.success("Model added to cart!");
      setIsCartOpen(true);
    } else {
      console.error("Model is null");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <Skeleton className="h-[600px] w-full lg:w-1/2 rounded-xl" />
          <div className="w-full lg:w-1/2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-destructive text-xl">Model not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2 relative">
          <div className="sticky top-8">
            {model.image ? (
              <Image
                src={`/uploads/printedModels/${model.image}`}
                alt={model.name}
                width={800}
                height={600}
                className="object-cover rounded-xl shadow-2xl"
              />
            ) : (
              <div className="h-[600px] bg-muted rounded-xl flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            <Badge className="absolute top-4 right-4 text-xl px-4 py-2 bg-primary text-primary-foreground">
              ${model.price ? model.price.toFixed(2) : "N/A"}
            </Badge>
          </div>
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">
              {model.name}
            </h1>
            <p className="text-xl text-muted-foreground">{model.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Printer3d className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Material
                </h3>
                <p className="text-lg font-semibold">{model.material}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <PaintBucket className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Color
                </h3>
                <p className="text-lg font-semibold">{model.color}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Resolution
                </h3>
                <p className="text-lg font-semibold">{model.resolution}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Resistance
                </h3>
                <p className="text-lg font-semibold">{model.resistance}%</p>
              </div>
            </div>
          </div>
          {model.dimensions && (
            <div className="flex items-center space-x-3">
              <Ruler className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Dimensions (L x W x H)
                </h3>
                <p className="text-lg font-semibold">
                  {model.dimensions.length} x {model.dimensions.width} x{" "}
                  {model.dimensions.height} cm
                </p>
              </div>
            </div>
          )}
          {model.weight && (
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Weight
                </h3>
                <p className="text-lg font-semibold">{model.weight} g</p>
              </div>
            </div>
          )}
          <div className="bg-muted p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Seller Information</h3>
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={`/uploads/printedModels/${model.image}`}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-medium">
                    {model.user?.name}{" "}
                    <span>
                      {model.printer_owner?.ratings || model.printer_owner?.ratings > 0 && (
                        <div className="flex items-center">
                          {" - "}
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-lg font-semibold">
                            {model.printer_owner.ratings.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </span>
                  </p>
                  <p className="text-muted-foreground mb-2">
                    {model.printer_owner?.bio}
                  </p>
                </div>
              </div>
              <Button className="text-lg py-6" variant="outline">
                <MessageCircle className="w-6 h-6 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
          <div className="w-full">
            <Button className="w-full text-lg py-6" onClick={handleAddToCart}>
              <ShoppingCart className="w-6 h-6 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
