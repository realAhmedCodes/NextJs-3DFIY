// components/search/ImageSearchForm.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const ImageSearchForm: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG and PNG images are allowed.");
        setSelectedImage(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("Image size should not exceed 5MB.");
        setSelectedImage(null);
        return;
      }

      setSelectedImage(file);
      setError("");
    }
  };

  const handleImageSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      setError("Please upload an image to search.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch("/api/search/searchByImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to perform image search.");
        return;
      }

      const data = await response.json();

      // Ensure 'modelIds' is present and is an array
      if (!data.modelIds || !Array.isArray(data.modelIds)) {
        console.error("Invalid response structure:", data);
        setError("Invalid response from search service.");
        return;
      }

      if (data.modelIds.length === 0) {
        setError("No similar models found.");
        return;
      }

      // Redirect to the models page with modelIds as query params
      const modelIds = data.modelIds.join(",");
      router.push(`/pages/ViewModels?modelIds=${modelIds}`);
    } catch (err: any) {
      console.error("Image search error:", err);
      setError("An unexpected error occurred during image search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-16">
      <form onSubmit={handleImageSearch} className="flex flex-col items-center">
        <Label
          htmlFor="searchImage"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Upload Image for Visual Search
        </Label>
        <Input
          id="searchImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full mb-4"
        />
        {error && (
          <Alert variant="destructive" className="w-full mb-4">
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? "Searching..." : "Search by Image"}
        </Button>
      </form>
    </div>
  );
};

export default ImageSearchForm;
