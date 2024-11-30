
// pages/price-estimate.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearFile } from "@/redux/features/uploadSlice";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const PriceEstimatePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { fileId, fileName } = useSelector((state) => state.upload);

  const [uploading, setUploading] = useState(false);
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("Default");
  const [resolution, setResolution] = useState("0.1");
  const [resistance, setResistance] = useState("100");
  const [cost, setCost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileId) {
      router.push("/"); // Redirect to upload page if no fileId
    }
  }, [fileId, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const payload = {
        file_id: fileId,
        material,
        color,
        resolution,
        resistance,
      };

      console.log("Payload:", payload);


      const response = await fetch("http://localhost:8000/cost-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setCost(data.cost);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Cost estimation failed");
      }
    } catch (error) {
      console.error("Failed to get cost estimation:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setCost(null);
    setMaterial("PLA");
    setColor("Default");
    setResolution("0.1");
    setResistance("100");
    // Optionally, keep the fileId or clear it
    // dispatch(clearFile());
  };

  const handleRemoveFile = () => {
    dispatch(clearFile());
    router.push("/");
  };

  console.log("Cost:", cost);


  return (
    <section className="w-full py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center w-full">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Complete Your Estimation
          </h3>
          <form onSubmit={handleSubmit} className="w-full">
            {/* Display Uploaded File Information */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <strong>Uploaded File:</strong> {fileName}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                Remove
              </Button>
            </div>

            {/* Material Selection */}
            <div className="mb-4">
              <label
                htmlFor="material"
                className="block text-sm font-medium text-gray-700"
              >
                Material
              </label>
              <Select
                id="material"
                value={material}
                onValueChange={setMaterial}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                required
              >
                <SelectTrigger>
                  <span>{material ? material : "Select Material"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="PLA" value="PLA">PLA</SelectItem>
                  <SelectItem id="PETG" value="PETG">PETG</SelectItem>
                  <SelectItem id="ABS" value="ABS">ABS</SelectItem>
                  <SelectItem id="ASA" value="ASA">ASA</SelectItem>
                  <SelectItem id="TPU" value="TPU">TPU</SelectItem>
                  <SelectItem id="Nylon" value="Nylon">Nylon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Input */}
            <div className="mb-4">
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                Color
              </label>
              <Input
                id="color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., White, Black, Custom"
                required
              />
            </div>

            {/* Resolution Input */}
            <div className="mb-4">
              <label
                htmlFor="resolution"
                className="block text-sm font-medium text-gray-700"
              >
                Resolution (mm) <span className="text-xs text-gray-500"> Lower the value, the more detailed the model and higher the price.</span>
              </label>
              <Input
                id="resolution"
                type="number"
                step="0.01"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="e.g., 0.1"
                min="0.05"
                required
              />

            </div>

            {/* Resistance Input */}
            <div className="mb-4">
              <label
                htmlFor="resistance"
                className="block text-sm font-medium text-gray-700"
              >
                Resistance (%)
              </label>
              <Input
                id="resistance"
                type="number"
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                placeholder="e.g., 100"
                min="10"
                max="100"
                required
              />
            </div>

            <Button type="submit" disabled={uploading} className="mt-6 w-full">
              {uploading ? "Calculating..." : "Get Estimation"}
            </Button>
          </form>

          {error && (
            <p className="mt-4 text-xs text-red-500 text-center">{error}</p>
          )}

          {cost && (
            <div className="mt-8 w-full text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Cost Estimation Result
              </h3>
              <p className="text-6xl font-bold text-primary mb-6">
                ${parseFloat(cost).toFixed(2)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleReset} className="w-full sm:w-auto">
                  Estimate Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default PriceEstimatePage;
