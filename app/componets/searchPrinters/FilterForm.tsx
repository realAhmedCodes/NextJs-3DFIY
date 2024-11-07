// components/searchPrinters/FilterForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  const handleInputFilterChange = (name: string, value: any) => {
    setInputFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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

    queryParams.page = "1"; // Reset to first page on new search
    queryParams.limit = "6"; // Set limit for printers

    // Update the URL with new query parameters
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/pages/printers/ViewPrinter?${queryString}`);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md mb-16">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-8 gap-6"
      >
        {/* Location Input */}
        <div className="md:col-span-2">
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

        {/* Printer Type Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="printer_type"
            className="block text-lg font-medium text-gray-700 mb-2"
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
            placeholder="e.g., 1000"
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

        {/* Materials Input */}
        <div className="md:col-span-2">
          <Label
            htmlFor="materials"
            className="block text-lg font-medium text-gray-700 mb-2"
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
            <option value="created_at">Newest</option>
            <option value="rating">Rating</option>
            {/* Add more sorting options as needed */}
          </select>
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

export default FilterForm;

/*

// Printers model
model Printers {
  printer_id       Int      @id @default(autoincrement())
  location         String   @db.VarChar(100)
  description      String   @db.Text
  name             String   @db.VarChar(50)
  printer_type     String   @db.VarChar(50)
  materials        String[] // Array of text values (automatically mapped to PostgreSQL `text[]`)
  price            Int?
  image            String   @db.VarChar(255)
  printer_owner_id Int?
  rating           Int?
  created_at       DateTime @default(now()) @db.Timestamptz
  updated_at       DateTime @updatedAt @db.Timestamptz
  colors           String[] // Array of text values
  services         String[] // Array of text values

  // Foreign key relation to Printer_Owners
  Printer_Owners   Printer_Owners? @relation(fields: [printer_owner_id], references: [printer_owner_id])

  // Relation with printer_orders
  printer_orders   printer_orders[]

  @@index([printer_id])
  @@index([printer_owner_id])
}
*/
