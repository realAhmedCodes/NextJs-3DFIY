// components/search/FilterForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import ShadCN Select components
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(true); // For collapsible filters on small screens

  const handleInputFilterChange = (name: string, value: any) => {
    setInputFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSortChange = (value: string) => {
    handleInputFilterChange("sortBy", value);
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
    router.push(`/models?${queryString}`); // Updated path
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
      {/* Toggle Button for Mobile */}
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left text-2xl font-semibold text-gray-800 focus:outline-none"
        >
          <span>Filters</span>
          {isOpen ? (
            <ChevronUpIcon className="w-6 h-6" />
          ) : (
            <ChevronDownIcon className="w-6 h-6" />
          )}
        </button>
      </div>


      {/* Filter Form */}
      {isOpen && (
        <form onSubmit={handleSearch} className="flex flex-wrap mt-4">
          {/* Keyword Input */}
          <div className="flex flex-col w-1/3 pr-2 mb-4">
            <Label
              htmlFor="keyword"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Keyword
            </Label>
            <Input
              id="keyword"
              name="keyword"
              type="text"
              placeholder="e.g., Model"
              value={inputFilters.keyword}
              onChange={(e) => handleInputFilterChange("keyword", e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Input */}
          <div className="flex flex-col w-1/3 px-2 mb-4">
            <Label
              htmlFor="category"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Category
            </Label>
            <Input
              id="category"
              name="category"
              type="text"
              placeholder="e.g., Vehicles"
              value={inputFilters.category}
              onChange={(e) =>
                handleInputFilterChange("category", e.target.value)
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tags Input */}
          <div className="flex flex-col w-1/3 pl-2 mb-4">
            <Label
              htmlFor="tags"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Tags
            </Label>
            <Input
              id="tags"
              name="tags"
              type="text"
              placeholder="e.g., 3D, Blender"
              value={inputFilters.tags}
              onChange={(e) => handleInputFilterChange("tags", e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Price Range Inputs */}
          <div className="flex flex-col md:col-span-2 w-1/2">
            <Label className="mb-2 text-lg font-medium text-gray-700">
              Price Range
            </Label>
            <div className="flex space-x-4">
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="Min"
                value={inputFilters.minPrice}
                onChange={(e) =>
                  handleInputFilterChange(
                    "minPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min={0}
              />
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="Max"
                value={inputFilters.maxPrice}
                onChange={(e) =>
                  handleInputFilterChange(
                    "maxPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min={0}
              />
            </div>
          </div>

          {/* Sort By Select */}
          <div className="flex flex-col w-1/3 ml-4">
            <Label
              htmlFor="sortBy"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Sort By
            </Label>
            <Select onValueChange={handleSortChange} defaultValue="">
              <SelectTrigger className="w-full border border-gray-300 rounded-lg">
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="likes_count">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col self-end ml-4 flex-1">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg"
            >
              Apply Filters
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FilterForm;
