"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Ensure you have Dialog components from Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UploadModelFileModal = ({ orderId, onClose }) => {
  const [modelFile, setModelFile] = useState(null);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modelFile) {
      toast.error("Please upload a 3D model file.");
      return;
    }

    setError(null);
    setSuccessMessage("");
    setLoading(true);

    const formData = new FormData();
    formData.append("order_file", modelFile);
    formData.append("order_id", orderId);
    formData.append("price", price);

    try {
      const response = await fetch(
        `/api/orders/desingerActiveOrders/uploadModelFile`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(errorDetail.error || "Failed to upload file.");
      }

      const data = await response.json();
      toast.success("File uploaded successfully!");
      setModelFile(null);

      // Optionally, refresh the page or refetch data
      router.refresh();

      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setModelFile(e.target.files[0]);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Model File</DialogTitle>
          <DialogDescription>
            Please upload the completed 3D model file to fulfill the order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert variant="success" className="mb-4">
              {successMessage}
            </Alert>
          )}

          {/* File Upload */}
          <div>
            <Label htmlFor="modelFile" className="block mb-1">
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModelFile(null)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="price">Set Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Set Model Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModelFileModal;
