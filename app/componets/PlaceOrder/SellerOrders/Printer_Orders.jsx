"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const resistances = [0, 20, 40, 60, 80, 100];

const resolutions = {
  detailed: "0.10",
  medium: "0.20",
  draft: "0.30",
};

const PrinterOrder = ({ printerId }) => {
  const [material, setMaterial] = useState("");
  const [printerMaterials, setPrinterMaterials] = useState([]);
  const [color, setColor] = useState("");
  const [resolution, setResolution] = useState("");
  const [resistance, setResistance] = useState("");
  const [cost, setCost] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printerOwnerId, setPrinterOwnerId] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // New state variables for user details
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { userId } = useSelector((state) => state.user);

  console.log(printerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsResponse, ownerResponse] = await Promise.all([
          fetch(`/api/printers/${printerId}/printerMaterials`),
          fetch(`/api/printers/${printerId}/printerOwnerId`),
        ]);

        if (!materialsResponse.ok) {
          toast.error("Failed to fetch printer materials");
          throw new Error("Failed to fetch printer materials");
        }
        if (!ownerResponse.ok) {
          toast.error("Failed to fetch printer owner details");
          throw new Error("Failed to fetch printer owner details");
        }

        const materialsData = await materialsResponse.json();
        const ownerData = await ownerResponse.json();

        setPrinterMaterials(materialsData.materials);
        setPrinterOwnerId(ownerData.printer_owner_id);
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [printerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modelFile) {
      toast.error("Please upload a 3D model file.");
      return;
    }

    setError(null);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", modelFile);
    formData.append("material", material);
    formData.append("color", color);
    formData.append("resolution", resolution);
    formData.append("resistance", resistance);
    formData.append("userId", userId);
    formData.append("instructions", instructions);
    formData.append("printer_Owner_id", printerOwnerId);

    // Append new user details
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);

    try {
      const response = await fetch(
        `/api/orders/printers/${printerId}/pendingOrders`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorDetail = await response.json();
        toast.error(errorDetail.error || "Failed to place order.");
        throw new Error(errorDetail.error || "Failed to place order.");
      }

      const data = await response.json();
      if (data.cost !== undefined) {
        setCost(data.cost);
        toast.success("Order placed successfully!");

        setMaterial("");
        setColor("");
        setResolution("");
        setResistance("");
        setInstructions("");
        setModelFile(null);
        setName("");
        setAddress("");
        setPhoneNumber("");
      } else {
        toast.error("Unexpected response format.");
        throw new Error("Unexpected response format.");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFileChange = (e) => {
    setModelFile(e.target.files[0]);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage} {cost && `Estimated Cost: $${cost.toFixed(2)}`}
        </Alert>
      )}

      {/* Name Field */}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* Address Field */}
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
          required
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          required
          pattern="^[0-9]{10,15}$" // Adjust pattern as needed
          title="Please enter a valid phone number (10-15 digits)"
        />
      </div>

      {/* Material Selection */}
      <div>
        <Label htmlFor="material">Material</Label>
        <Select
          id="material"
          value={material}
          onValueChange={(value) => setMaterial(value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Material" />
          </SelectTrigger>
          <SelectContent>
            {printerMaterials.map((mat, index) => (
              <SelectItem key={index} value={mat}>
                {mat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color Selection */}
      <div>
        <Label htmlFor="color">Color</Label>
        <Select
          id="color"
          value={color}
          onValueChange={(value) => setColor(value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Color" />
          </SelectTrigger>
          <SelectContent>
            {["Red", "Blue", "Green", "Black", "White"].map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resolution Selection */}
      <div>
        <Label htmlFor="resolution">Resolution</Label>
        <Select
          id="resolution"
          value={resolution}
          onValueChange={(value) => setResolution(value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Resolution" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(resolutions).map((key) => (
              <SelectItem key={key} value={resolutions[key]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resistance Selection */}
      <div>
        <Label htmlFor="resistance">Resistance</Label>
        <Select
          id="resistance"
          value={resistance}
          onValueChange={(value) => setResistance(value)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Resistance" />
          </SelectTrigger>
          <SelectContent>
            {resistances.map((res) => (
              <SelectItem key={res} value={res}>
                {res}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Instructions */}
      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter any special instructions"
          required
        />
      </div>

      {/* File Upload */}
      <div>
        <Label htmlFor="modelFile">
          Upload Your 3D Model File (.stl, .obj)
        </Label>
        <Input
          id="modelFile"
          type="file"
          accept=".stl,.obj"
          onChange={handleFileChange}
          required
        />
        {modelFile && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">{modelFile.name}</span>
            <Button type="button" onClick={() => setModelFile(null)}>
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <Button type="submit" className="w-full">
          Place Order
        </Button>
      </div>

      {/* Estimated Cost */}
      {cost !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="text-lg font-semibold">
            Estimated Cost: ${cost.toFixed(2)}
          </h3>
        </div>
      )}
    </form>
  );
};

export default PrinterOrder;
