// components/PriceEstimate.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ShoppingCart, Eye } from "lucide-react";
import Dropzone from "@/components/ui/dropzone";

const PriceEstimate = () => {
  const router = useRouter();
  const { userId, email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (uploadedFile) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    // If your backend requires additional fields, append them here with default values
    // Example:
    // formData.append("material", "PLA");
    // formData.append("color", "White");
    // formData.append("resolution", "0.1");
    // formData.append("resistance", "50");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      console.log("Cost estimation received:", data.cost);
      router.push({
        pathname: "/pages/cost-estimation",
        query: { cost: data.cost },
      });
    } catch (err) {
      console.error("Failed to upload file:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="w-full py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* File Upload Section */}
          <Card className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center">
            <Upload className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
              Get Free Printing Cost Estimation
            </h3>
            <Dropzone onFileUpload={handleFileChange} />
            {uploading && (
              <p className="mt-4 text-sm text-gray-600">
                Uploading and processing...
              </p>
            )}
            {error && (
              <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 text-center">
              Files accepted: *.stl, *.obj. Maximum size: 32 MB.
            </p>
          </Card>

          {/* Order & Explore Section */}
          <Card className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Place Custom Print Orders Now! Or Explore Ready-Made Items
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order" className="w-full sm:w-auto">
                <Button size="lg" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Now
                </Button>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  Explore
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PriceEstimate;
