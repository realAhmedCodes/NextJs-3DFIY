"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

const printerOptions = {
  FDM: {
    name: "Fused Deposition Modeling",
    materials: [
      "PLA (Polylactic Acid)",
      "ABS (Acrylonitrile Butadiene Styrene)",
      "PETG (Polyethylene Terephthalate Glycol-modified)",
      "TPU (Thermoplastic Polyurethane)",
      "Nylon",
    ],
  },
  SLA: {
    name: "Stereolithography",
    materials: [
      "Standard Resin",
      "Tough Resin",
      "Flexible Resin",
      "Castable Resin",
    ],
  },
  SLS: {
    name: "Selective Laser Sintering",
    materials: [
      "Nylon (Polyamide)",
      "TPU (Thermoplastic Polyurethane)",
      "Glass-Filled Nylon",
      "Alumide",
    ],
  },
  DLP: {
    name: "Digital Light Processing",
    materials: ["Standard Resin", "Tough Resin", "Flexible Resin"],
  },
};

const Page = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [printerType, setPrinterType] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [printerOwnerId, setPrinterOwnerId] = useState(null);
  const [colors, setColors] = useState([""]);
  const [services, setServices] = useState([""]);

  const { sellerId } = useSelector((state) => state.user);

  useEffect(() => {
    if (sellerId) {
      setPrinterOwnerId(sellerId);
    }
  }, [sellerId]);

  useEffect(() => {
    if (printerType) {
      setMaterials(printerOptions[printerType]?.materials || []);
      setSelectedMaterials([]); // Reset selected materials
    } else {
      setMaterials([]);
      setSelectedMaterials([]); // Reset selected materials
    }
  }, [printerType]);

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prevSelectedMaterials) =>
      prevSelectedMaterials.includes(material)
        ? prevSelectedMaterials.filter((m) => m !== material)
        : [...prevSelectedMaterials, material]
    );
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([...colors, ""]);
  };

  const removeColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, ""]);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("printer_owner_id", printerOwnerId);
    formData.append("price", price);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("printerType", printerType);
    formData.append("materials", JSON.stringify(selectedMaterials));
    formData.append("colors", JSON.stringify(colors));
    formData.append("services", JSON.stringify(services));
    formData.append("location", location);
    formData.append("image", image);

    try {
      const response = await fetch("/api/printers/printerUpload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("Printer uploaded successfully:", data);
        // Optionally, reset the form after successful submission
        setName("");
        setDescription("");
        setLocation("");
        setPrinterType("");
        setSelectedMaterials([]);
        setPrice("");
        setImage(null);
        setColors([""]);
        setServices([""]);
      }
    } catch (error) {
      console.error(error);
      console.log("Server Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Upload a New Printer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Printer Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter printer name"
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Description
              </label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Location
              </label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Printer Type */}
            <div>
              <label
                htmlFor="printerType"
                className="block text-sm font-medium text-gray-700"
              >
                Select Printer Type
              </label>
              <Select
                value={printerType}
                onValueChange={(value) => setPrinterType(value)}
                required
              >
                <SelectTrigger className="mt-1 text-left">
                  <SelectValue placeholder="Select a printer type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(printerOptions).map((type) => (
                    <SelectItem key={type} value={type}>
                      {printerOptions[type].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Materials */}
            {materials.length > 0 && (
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Select Materials
                </span>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {materials.map((material) => (
                    <label key={material} className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedMaterials.includes(material)}
                        onCheckedChange={() => handleMaterialChange(material)}
                      />
                      <span className="text-sm text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Colors
              </span>
              <div className="mt-2 space-y-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      placeholder={`Color ${index + 1}`}
                      required
                      className="flex-1"
                    />
                    {colors.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeColor(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColor}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Color
                </Button>
              </div>
            </div>

            {/* Services */}
            <div>
              <span className="block text-sm font-medium text-gray-700">
                Services
              </span>
              <div className="mt-2 space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      placeholder={`Service ${index + 1}`}
                      required
                      className="flex-1"
                    />
                    {services.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeService(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addService}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Price
              </label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                required
                className="mt-1 block w-full"
                min="0"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="mt-1 block w-full"
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full">
                Upload Printer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
