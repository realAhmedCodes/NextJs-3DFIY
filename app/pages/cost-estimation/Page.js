// pages/cost-estimation.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Footer from "@/components/Footer"; // Ensure Footer is correctly imported

const CostEstimation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cost, setCost] = useState(null);

  useEffect(() => {
    const costParam = searchParams.get("cost");
    if (costParam) {
      setCost(parseFloat(costParam));
    } else {
      // If no cost data, redirect to home
      router.push("/");
    }
  }, [searchParams, router]);

  if (cost === null) {
    return null; // Optionally, display a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-green-600">3Dify</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <Card className="p-8 bg-white shadow-lg rounded-3xl max-w-md w-full">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 text-center mt-4">
            Cost Estimation Result
          </h2>
          <p className="mt-2 text-lg text-gray-600 text-center">
            The estimated cost for printing your model is:
          </p>
          <div className="mt-4">
            <span className="text-4xl font-bold text-green-600">
              ${cost.toFixed(2)}
            </span>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full sm:w-auto"
            >
              Upload Another Model
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/explore")}
              className="w-full sm:w-auto"
            >
              Explore Models
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default CostEstimation;
