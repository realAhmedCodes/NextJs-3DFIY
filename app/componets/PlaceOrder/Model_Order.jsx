"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import ModelEstimate from "../ModelEstimate";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const ModelOrder = ({ sellerId, userId }) => {
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [fileFormat, setFileFormat] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setReferenceFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !modelName ||
      !description ||
      !dimensions.length ||
      !dimensions.width ||
      !dimensions.height ||
      !fileFormat
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("modelName", modelName);
    formData.append("description", description);
    formData.append("dimensions", JSON.stringify(dimensions));
    formData.append("fileFormat", fileFormat);
    formData.append("referenceFile", referenceFile);
    formData.append("additionalNotes", additionalNotes);
    formData.append("userId", userId);

    try {
      const response = await fetch(`/api/orders/ModelOrders/${sellerId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const result = await response.json();
      console.log("Order submitted successfully", result);
      // Reset form fields
      setModelName("");
      setDescription("");
      setDimensions({ length: "", width: "", height: "" });
      setFileFormat("");
      setReferenceFile(null);
      setAdditionalNotes("");
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="modelName">Model Name</Label>
          <Input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Dimensions (in cm)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Length"
              value={dimensions.length}
              onChange={(e) =>
                setDimensions({ ...dimensions, length: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({ ...dimensions, height: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="fileFormat">Preferred File Format</Label>
          <Select
            id="fileFormat"
            value={fileFormat}
            onValueChange={(value) => setFileFormat(value)}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select File Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stl">STL</SelectItem>
              <SelectItem value="obj">OBJ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="referenceFile">
            Upload Reference File (optional)
          </Label>
          <Input
            type="file"
            id="referenceFile"
            onChange={handleFileChange}
            accept=".stl,.obj"
          />
          {referenceFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected File: {referenceFile.name}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="additionalNotes">Additional Notes</Label>
          <Textarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Order"
          )}
        </Button>
      </form>

      <Drawer>
        <DrawerTrigger>
          <Button className="w-full" variant="outline">Get Cost and Time Estimation</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Get Cost and Time Estimation</DrawerTitle>
            <DrawerDescription>
              Get a cost and time estimation for your order based on the provided requirements.
            </DrawerDescription>
          </DrawerHeader>
          <ModelEstimate />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ModelOrder;
