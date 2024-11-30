// components/searchDesigners/DesignerFilterForm.tsx
// components/searchDesigners/DesignerFilterForm.tsx

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
} from "@/components/ui/select";
import { ChevronDownIcon } from "@heroicons/react/24/solid"; // Ensure you have Heroicons installed
import axios from "axios"; // Import Axios
import { useSelector } from "react-redux"; // Import useSelector
import { RootState } from "@/redux/store";

interface FilterFormProps {
  initialFilters: {
    name: string;
    location: string;
  };
}

const FilterForm: React.FC<FilterFormProps> = ({ initialFilters }) => {
  const [inputFilters, setInputFilters] = useState({
    ...initialFilters,
    sortBy: "", // Initialize sortBy
  });
  const router = useRouter();

const { userId, email, profile_pic, sellerType } = useSelector(
  (state: RootState) => state.user
);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSortChange = (value: string) => {
    setInputFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams: Record<string, string> = {};

    if (inputFilters.location) {
      queryParams.location = inputFilters.location;
    }
    if (inputFilters.sortBy) {
      queryParams.sortBy = inputFilters.sortBy;
    }

    queryParams.page = "1"; // Reset to first page on new search
    queryParams.limit = "6"; // Set limit for designers

    // Log the search
    try {
      if (userId) {
        await axios.post("/api/log_search/designers", {
          user_id: userId,
          location: inputFilters.location.trim(),
        });
        console.log("Designer search logged successfully.");
      } else {
        console.warn("User ID not available. Search not logged.");
      }
    } catch (error) {
      console.error("Error logging designer search:", error);
    }

    // Update the URL with new query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/pages/users/userProfiles/designers?${queryString}`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {/* Name Input - Ignored for logging */}
        <div className="flex flex-col">
          <Label
            htmlFor="name"
            className="mb-2 text-lg font-medium text-gray-700"
          >
            Designer Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Bilal"
            value={inputFilters.name}
            onChange={handleInputChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location Input */}
        <div className="flex flex-col">
          <Label
            htmlFor="location"
            className="mb-2 text-lg font-medium text-gray-700"
          >
            Location
          </Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="e.g., Lahore"
            value={inputFilters.location}
            onChange={handleInputChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sort By Select */}
        <div className="flex flex-col">
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
              <SelectItem value="ratings">Ratings</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex flex-col justify-end">
          <Button type="submit">Search</Button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
