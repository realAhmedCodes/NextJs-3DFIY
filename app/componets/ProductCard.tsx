// components/products/ProductCard.tsx

"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  tags: string[];
  createdAt: string;
  likes_count: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-gray-600">${product.price.toFixed(2)}</p>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <div className="flex items-center text-gray-500">
            <span className="mr-1">{product.likes_count}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 9l-3 3m0 0l-3-3m3 3V2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
