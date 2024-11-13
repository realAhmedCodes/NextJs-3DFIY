"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";

const resistances = [0, 20, 40, 60, 80, 100];
const resolutions = {
  detailed: "0.10",
  medium: "0.20",
  draft: "0.30",
};

type FormData = {
  user_id: number | "";
  printer_owner_id: number | "";
  name: string;
  description: string;
  material: string;
  color: string;
  resolution: string;
  resistance: string;
  dimensions: { length: number; width: number; height: number };
  weight: number | "";
  image: string;
  status: string;
  price: number | "";
};

const PrintedModelUpload = () => {
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    printer_owner_id: "",
    name: "",
    description: "",
    material: "",
    color: "",
    resolution: "",
    resistance: "",
    dimensions: { length: 0, width: 0, height: 0 },
    weight: "",
    image: "",
    status: "available",
    price: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDimensionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dimension: "length" | "width" | "height"
  ) => {
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [dimension]: Number(e.target.value),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/uploadPrinterModels",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: "Uploaded successfully!",
        });
        router.push("/models"); // Redirect to models page after upload
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Invalid data!",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle>Upload Printed 3D Model</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                name="material"
                type="text"
                value={formData.material}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="resolution">Resolution</Label>
              <select
                id="resolution"
                name="resolution"
                value={formData.resolution}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                {Object.entries(resolutions).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="resistance">Resistance</Label>
              <select
                id="resistance"
                name="resistance"
                value={formData.resistance}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
              >
                {resistances.map((level) => (
                  <option key={level} value={level}>
                    {level}%
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Dimensions (L x W x H)</Label>
              <div className="flex space-x-2">
                <Input
                  name="length"
                  type="number"
                  placeholder="Length"
                  onChange={(e) => handleDimensionChange(e, "length")}
                />
                <Input
                  name="width"
                  type="number"
                  placeholder="Width"
                  onChange={(e) => handleDimensionChange(e, "width")}
                />
                <Input
                  name="height"
                  type="number"
                  placeholder="Height"
                  onChange={(e) => handleDimensionChange(e, "height")}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Weight (g)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Upload Model
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintedModelUpload;
