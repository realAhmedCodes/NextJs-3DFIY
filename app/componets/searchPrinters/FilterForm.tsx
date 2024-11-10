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

interface FilterForm {
  initialFilters: {
    location: string;
    printer_type: string;
    materials: string;
    minPrice: number;
    maxPrice: number;
    sortBy: string;
  };
}

const FilterForm: React.FC<FilterForm> = ({ initialFilters }) => {
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
    <div className="bg-white p-10 rounded-2xl shadow-xl mb-20">
      {/* Toggle Button for Mobile */}
      <div className="mb-6 lg:hidden">
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
        className={`grid grid-cols-1 lg:grid-cols-8 gap-8 ${
          isOpen ? "block" : "hidden"
        } lg:block`}
      >
        {/* Location Input */}
        <div className="lg:col-span-2 flex flex-col">
          <Label
            htmlFor="location"
            className="mb-3 text-xl font-semibold text-gray-800"
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
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Printer Type Input */}
        <div className="lg:col-span-2 flex flex-col">
          <Label
            htmlFor="printer_type"
            className="mb-3 text-xl font-semibold text-gray-800"
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
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Min Price Input */}
        <div className="lg:col-span-2 flex flex-col">
          <Label
            htmlFor="minPrice"
            className="mb-3 text-xl font-semibold text-gray-800"
          >
            Minimum Price
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="e.g., 0"
            value={inputFilters.minPrice}
            onChange={(e) =>
              handleInputFilterChange("minPrice", parseFloat(e.target.value) || 0)
            }
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            min={0}
          />
        </div>

        {/* Max Price Input */}
        <div className="lg:col-span-2 flex flex-col">
          <Label
            htmlFor="maxPrice"
            className="mb-3 text-xl font-semibold text-gray-800"
          >
            Maximum Price
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="e.g., 1000"
            value={inputFilters.maxPrice}
            onChange={(e) =>
              handleInputFilterChange("maxPrice", parseFloat(e.target.value) || 0)
            }
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            min={0}
          />
        </div>

        {/* Materials Input */}
        <div className="lg:col-span-2 flex flex-col">
          <Label
            htmlFor="materials"
            className="mb-3 text-xl font-semibold text-gray-800"
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
            className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Sort By Select */}
        <div className="lg:col-span-2 flex flex-col">
          <Label
            htmlFor="sortBy"
            className="mb-3 text-xl font-semibold text-gray-800"
          >
            Sort By
          </Label>
          <Select onValueChange={handleSortChange} defaultValue="">
            <SelectTrigger className="w-full border border-gray-300 rounded-xl">
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
        <div className="lg:col-span-8 flex justify-end">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition duration-300"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
