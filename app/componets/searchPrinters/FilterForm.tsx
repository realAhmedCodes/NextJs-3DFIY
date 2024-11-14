// components/searchPrinters/FilterForm.tsx

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
    location: string;
    printer_type: string;
    materials: string;
    minPrice: number;
    maxPrice: number;
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

    if (inputFilters.location) {
      queryParams.location = inputFilters.location;
    }
    if (inputFilters.printer_type) {
      queryParams.printer_type = inputFilters.printer_type;
    }
    if (inputFilters.minPrice > 0) {
      queryParams.minPrice = inputFilters.minPrice.toString();
    }
    if (inputFilters.maxPrice > 0) {
      queryParams.maxPrice = inputFilters.maxPrice.toString();
    }
    if (inputFilters.materials) {
      queryParams.materials = inputFilters.materials;
    }
    if (inputFilters.sortBy) {
      queryParams.sortBy = inputFilters.sortBy;
    }

    // Always reset to page 1 on new search
    queryParams.page = "1";
    queryParams.limit = "6"; // Ensure consistent limit

    // Update the URL with new query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/pages/printers/ViewPrinter?${queryString}`); // Updated path
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
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
      <form
        onSubmit={handleSearch}
        className={`grid grid-cols-1 mt-4 lg:grid-cols-8 gap-8 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {/* First Row: Location, Printer Type, Materials */}
        <div className="lg:col-span-8 flex flex-col lg:flex-row lg:space-x-4">
          {/* Location Input */}
          <div className="flex flex-col lg:w-1/3 mb-4 lg:mb-0">
            <Label
              htmlFor="location"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., Lahore"
              value={inputFilters.location}
              onChange={(e) =>
                handleInputFilterChange("location", e.target.value)
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Printer Type Input */}
          <div className="flex flex-col lg:w-1/3 mb-4 lg:mb-0">
            <Label
              htmlFor="printer_type"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Printer Type
            </Label>
            <Input
              id="printer_type"
              type="text"
              placeholder="e.g., SLA"
              value={inputFilters.printer_type}
              onChange={(e) =>
                handleInputFilterChange("printer_type", e.target.value)
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Materials Input */}
          <div className="flex flex-col lg:w-1/3">
            <Label
              htmlFor="materials"
              className="mb-2 text-lg font-medium text-gray-700"
            >
              Materials
            </Label>
            <Input
              id="materials"
              type="text"
              placeholder="e.g., Tough Resin"
              value={inputFilters.materials}
              onChange={(e) =>
                handleInputFilterChange("materials", e.target.value)
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Second Row: Min Price, Max Price, Sort By, Search Button */}
        <div className="lg:col-span-8 flex flex-col lg:flex-row lg:space-x-4">
          {/* Minimum Price Input */}
          <div className="w-1/2 gap-4 flex mb-4 lg:mb-0">
            <div className="flex flex-col w-1/2">
              <Label
                htmlFor="minPrice"
                className="mb-2 text-lg font-medium text-gray-700"
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
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min={0}
              />
            </div>

            {/* Maximum Price Input */}
            <div className="flex flex-col w-1/2">
              <Label
                htmlFor="maxPrice"
                className="mb-2 text-lg font-medium text-gray-700"
              >
                Maximum Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="e.g., 1000"
                value={inputFilters.maxPrice}
                onChange={(e) =>
                  handleInputFilterChange(
                    "maxPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min={0}
              />
            </div>
          </div>

          {/* Sort By Select */}
          <div className="flex flex-col lg:w-1/4 mb-4 lg:mb-0">
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
                <SelectItem value="created_at">Newest</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex flex-col lg:w-1/4 justify-end">
            <Button type="submit">Search</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
