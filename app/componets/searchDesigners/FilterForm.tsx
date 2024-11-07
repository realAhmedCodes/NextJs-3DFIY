// components/search/DesignerFilterForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterFormProps {
  initialFilters: {
    name: string;
    location: string;
  };
}

const DesignerFilterForm: React.FC<FilterFormProps> = ({ initialFilters }) => {
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

    if (inputFilters.name) {
      queryParams.name = inputFilters.name;
    }
    if (inputFilters.location) {
      queryParams.location = inputFilters.location;
    }

    queryParams.page = "1"; // Reset to first page on new search
    queryParams.limit = "6"; // Set limit for designers

    // Update the URL with new query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/pages/users/userProfiles/designers?${queryString}`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-16">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-8 gap-6"
      >
        {/* Name Input */}
        <div className="md:col-span-4">
          <Label
            htmlFor="name"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Bilal"
            value={inputFilters.name}
            onChange={(e) => handleInputFilterChange("name", e.target.value)}
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Location Input */}
        <div className="md:col-span-4">
          <Label
            htmlFor="location"
            className="block text-lg font-medium text-gray-700 mb-2"
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
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-8 flex justify-end">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg shadow-md"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DesignerFilterForm;
