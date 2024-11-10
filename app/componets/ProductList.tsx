// components/products/ProductList.tsx

"use client";

import React from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductCard from "./ProductCard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProductList: React.FC = () => {
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const { data, error, isLoading } = useSWR(
    `/api/products?${query}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load products.
      </div>
    );
  }

  if (data.products.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {data.products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
