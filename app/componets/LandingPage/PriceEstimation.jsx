"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, ShoppingCart, Eye } from "lucide-react";

const PriceEstimation = () => {
  const router = useRouter();
  const { userId, email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setUploading(true);

    try {
      // Replace with actual upload logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Navigate to upload page with file details if needed
      router.push({
        pathname: "/upload",
        query: { file: uploadedFile.name },
      });
    } catch (error) {
      console.error("Failed to upload file.", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileUpload(droppedFiles[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* File Upload Section */}
          <Card
            className={`p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center cursor-pointer relative ${
              isDragActive ? "border-2 border-primary" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-4">
              Get Free Printing Cost Estimation
            </h3>
            {uploading && (
              <p className="mt-4 text-sm text-gray-600">Uploading...</p>
            )}
            <p className="mt-2 text-xs text-gray-500 text-center">
              Files accepted: *.stl, *.obj. Maximum size: 32 MB.
            </p>
            <input
              type="file"
              accept=".stl,.obj"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
            {isDragActive && (
              <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center rounded-3xl">
                <p className="text-primary text-lg">Drop the file here</p>
              </div>
            )}
          </Card>

          {/* Order & Explore Section */}
          <Card className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Place Custom Print Orders Now! Or Explore Ready-Made Items
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Order Now
                </Button>
              </Link>
              <Link href="#" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
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

export default PriceEstimation;
