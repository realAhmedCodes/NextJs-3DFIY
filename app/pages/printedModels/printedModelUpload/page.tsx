"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  CuboidIcon as Cube,
  Upload,
  DollarSign,
  Weight,
  Ruler,
  PaintBucket,
} from "lucide-react";

const resistances = [0, 20, 40, 60, 80, 100];
const resolutions = {
  Detailed: "0.10",
  Medium: "0.20",
  Draft: "0.30",
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

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles[0]) {
        setFormData({ ...formData, image: acceptedFiles[0] });
        setPreviewUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
    [formData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    multiple: false,
  });

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
      } else {
        const errorData = await response.json();
        toast.warning(errorData.error || "Invalid data!");
      }
    } catch (error) {
      toast.warning("An unexpected error occurred. Please try again.");
    }
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(
      (value) => value !== "" && value !== null
    ).length;
    return (filledFields / totalFields) * 100;
  };

  return (
    <div className="flex bg-background p-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6">Upload Printed 3D Model</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Progress value={calculateProgress()} className="w-full mb-4" />
                <div>
                  <Label htmlFor="name">Model Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="material"
                      className="flex items-center gap-1 mb-1"
                    >
                      Material
                      <Cube className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="material"
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="color"
                      className="flex items-center gap-1 mb-1"
                    >
                      Color
                      <PaintBucket className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resolution">Resolution</Label>
                    <Select
                      name="resolution"
                      value={formData.resolution}
                      onValueChange={(value) =>
                        setFormData({ ...formData, resolution: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(resolutions).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="resistance">Resistance</Label>
                    <Select
                      name="resistance"
                      value={formData.resistance}
                      onValueChange={(value) =>
                        setFormData({ ...formData, resistance: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Resistance" />
                      </SelectTrigger>
                      <SelectContent>
                        {resistances.map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {level}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-1 mb-1">
                    Dimensions (L x W x H)
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="grid grid-cols-3 gap-2 flex-grow">
                      <Input
                        name="length"
                        type="number"
                        placeholder="Length"
                        value={formData.dimensions.length}
                        onChange={(e) => handleDimensionChange(e, "length")}
                        required
                      />
                      <Input
                        name="width"
                        type="number"
                        placeholder="Width"
                        value={formData.dimensions.width}
                        onChange={(e) => handleDimensionChange(e, "width")}
                        required
                      />
                      <Input
                        name="height"
                        type="number"
                        placeholder="Height"
                        value={formData.dimensions.height}
                        onChange={(e) => handleDimensionChange(e, "height")}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="weight"
                      className="flex items-center gap-1 mb-1"
                    >
                      Weight (g)
                      <Weight className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="price"
                      className="flex items-center gap-1 mb-1"
                    >
                      Price
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Upload Model
                </Button>
              </form>
            </div>
            <div className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary" : "border-muted-foreground"
                }`}
              >
                <input {...getInputProps()} />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Drag & drop an image here, or click to select one
                    </p>
                  </div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-muted p-6 rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-4">Model Preview</h2>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Material:</strong> {formData.material}
                  </p>
                  <p>
                    <strong>Color:</strong> {formData.color}
                  </p>
                  <p>
                    <strong>Resolution:</strong> {formData.resolution}
                  </p>
                  <p>
                    <strong>Resistance:</strong> {formData.resistance}%
                  </p>
                  <p>
                    <strong>Dimensions:</strong> {formData.dimensions.length} x{" "}
                    {formData.dimensions.width} x {formData.dimensions.height}
                  </p>
                  <p>
                    <strong>Weight:</strong> {formData.weight}g
                  </p>
                  <p>
                    <strong>Price:</strong> ${formData.price}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintedModelUpload;
