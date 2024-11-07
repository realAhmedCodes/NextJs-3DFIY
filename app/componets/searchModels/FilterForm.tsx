// components/search/FilterForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterFormProps {
  initialFilters: {
    keyword: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    tags: string;
    sortBy: string;
  };
}

const FilterForm: React.FC<FilterFormProps> = ({ initialFilters }) => {
  const [inputFilters, setInputFilters] = useState(initialFilters);
  const router = useRouter();

  const handleInputFilterChange = (name: string, value: any) => {
    setInputFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams: Record<string, string> = {};

    if (inputFilters.keyword) {
      queryParams.keyword = inputFilters.keyword;
    }
    if (inputFilters.category) {
      queryParams.category = inputFilters.category;
    }
    if (inputFilters.minPrice > 0) {
      queryParams.minPrice = inputFilters.minPrice.toString();
    }
    if (inputFilters.maxPrice > 0) {
      queryParams.maxPrice = inputFilters.maxPrice.toString();
    }
    if (inputFilters.tags) {
      queryParams.tags = inputFilters.tags;
    }
    if (inputFilters.sortBy) {
      queryParams.sortBy = inputFilters.sortBy;
    }

    // Always reset to page 1 on new search
    queryParams.page = "1";
    queryParams.limit = "9"; // Ensure consistent limit

    // Update the URL with new query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/pages/ViewModels?${queryString}`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-16">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-8 gap-6"
      >
        {/* Keyword Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="keyword"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Keyword
          </Label>
          <Input
            id="keyword"
            type="text"
            placeholder="e.g., Car"
            value={inputFilters.keyword}
            onChange={(e) => handleInputFilterChange("keyword", e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Category Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="category"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Category
          </Label>
          <Input
            id="category"
            type="text"
            placeholder="e.g., Vehicles"
            value={inputFilters.category}
            onChange={(e) =>
              handleInputFilterChange("category", e.target.value)
            }
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Min Price Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="minPrice"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Minimum Price
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="e.g., 0"
            value={inputFilters.minPrice}
            onChange={(e) =>
              handleInputFilterChange(
                "minPrice",
                parseFloat(e.target.value) || 0
              )
            }
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            min={0}
          />
        </div>

        {/* Max Price Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="maxPrice"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Maximum Price
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="e.g., 100"
            value={inputFilters.maxPrice}
            onChange={(e) =>
              handleInputFilterChange(
                "maxPrice",
                parseFloat(e.target.value) || 0
              )
            }
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
            min={0}
          />
        </div>

        {/* Tags Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="tags"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Tags
          </Label>
          <Input
            id="tags"
            type="text"
            placeholder="e.g., 3D, Blender"
            value={inputFilters.tags}
            onChange={(e) => handleInputFilterChange("tags", e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Sort By Select */}
        <div className="md:col-span-2">
          <Label
            htmlFor="sortBy"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Sort By
          </Label>
          <select
            id="sortBy"
            value={inputFilters.sortBy}
            onChange={(e) => handleInputFilterChange("sortBy", e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="createdAt">Newest</option>
            <option value="likes_count">Popularity</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2 flex items-end">
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
