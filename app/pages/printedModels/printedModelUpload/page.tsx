"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const resistances = [0, 20, 40, 60, 80, 100];
const resolutions = {
  detailed: "0.10",
  medium: "0.20",
  draft: "0.30",
};

type FormDataType = {
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
  image: File | null;
  status: string;
  price: number | null;
};

const PrintedModelUpload = () => {
  const [formData, setFormData] = useState<FormDataType>({
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
    image: null,
    status: "available",
    price: null,
  });

  const { sellerId, userId } = useSelector((state: any) => state.user); // Adjust the selector based on your state structure

  const router = useRouter();
  const dispatch = useDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct FormData for file upload
    const uploadData = new FormData();
    uploadData.append("user_id", userId.toString());
    uploadData.append("printer_owner_id", sellerId.toString());
    uploadData.append("name", formData.name);
    uploadData.append("description", formData.description);
    uploadData.append("material", formData.material);
    uploadData.append("color", formData.color);
    uploadData.append("resolution", formData.resolution);
    uploadData.append("resistance", formData.resistance);
    uploadData.append("dimensions", JSON.stringify(formData.dimensions));
    if (formData.weight !== "")
      uploadData.append("weight", formData.weight.toString());
    if (formData.image) uploadData.append("image", formData.image);
    uploadData.append("status", formData.status);
    if (formData.price !== null)
      uploadData.append("price", formData.price.toString());

    // Debugging - log the data being sent
    for (const [key, value] of uploadData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch("/api/printedModels/upload", {
        method: "POST",
        body: uploadData,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        toast("Uploaded successfully!");
        router.push("/models");
      } else {
        const errorData = await response.json();
        toast.warning(errorData.error || "Invalid data!");
      }
    } catch (error) {
      toast.warning("An unexpected error occurred. Please try again.");
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
                required
              >
                <option value="">Select Resolution</option>
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
                required
              >
                <option value="">Select Resistance</option>
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
                  required
                />
                <Input
                  name="width"
                  type="number"
                  placeholder="Width"
                  onChange={(e) => handleDimensionChange(e, "width")}
                  required
                />
                <Input
                  name="height"
                  type="number"
                  placeholder="Height"
                  onChange={(e) => handleDimensionChange(e, "height")}
                  required
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
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                required
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
