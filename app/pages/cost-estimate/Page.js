// pages/cost-estimate.js

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CostEstimate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cost = searchParams.get("cost");

  return (
    <section className="w-full py-24 bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-6 max-w-md">
        <Card className="p-8 bg-white shadow-lg rounded-3xl flex flex-col items-center">
          <h3 className="text-3xl font-semibold text-gray-800 text-center mb-4">
            Cost Estimation Result
          </h3>
          <p className="text-6xl font-bold text-primary mb-6">
            ${parseFloat(cost).toFixed(2)}
          </p>
          <Button
            onClick={() => router.push("/price-estimate")}
            className="mt-4"
          >
            Upload Another File
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default CostEstimate;
