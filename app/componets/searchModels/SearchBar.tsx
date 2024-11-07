// components/SearchBar.jsx
"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Category {
  category_id: number;
  name: string;
}

interface SearchParams {
  keyword: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  tags: string;
  sortBy: string;
}

const SearchBar: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    tags: "",
    sortBy: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<Category[]>(
    []
  );

  const router = useRouter();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("/api/search/categoryApi");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes for general fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes specifically for the category field with autocomplete
  const handleCategoryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, category: value }));

    const suggestions = categories.filter((cat) =>
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setCategorySuggestions(suggestions);
  };

  // Handle selecting a category from suggestions
  const handleCategorySelect = (categoryName: string) => {
    setSearchParams((prev) => ({ ...prev, category: categoryName }));
    setCategorySuggestions([]);
  };

  // Handle form submission to perform search
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value.trim() !== "") {
        query.append(key, value.trim());
      }
    });

    // Navigate to Search Models page with query parameters
    router.push(`/pages/search-models?${query.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md mb-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        Find Your 3D Model
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Keyword Search */}
        <input
          type="text"
          name="keyword"
          placeholder="Search by keyword..."
          value={searchParams.keyword}
          onChange={handleInputChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Category Filter with Autocomplete */}
        <div className="relative">
          <input
            type="text"
            name="category"
            placeholder="Search category..."
            value={searchParams.category}
            onChange={handleCategoryInputChange}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            autoComplete="off"
          />
          {categorySuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border mt-2 max-h-60 overflow-auto w-full rounded-md shadow-lg">
              {categorySuggestions.map((cat) => (
                <li
                  key={cat.category_id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price Range */}
        <div className="flex space-x-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={searchParams.minPrice}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={searchParams.maxPrice}
            onChange={handleInputChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={searchParams.tags}
          onChange={handleInputChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Sort By */}
        <select
          name="sortBy"
          value={searchParams.sortBy}
          onChange={handleInputChange}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="createdAt">Newest</option>
          <option value="likes_count">Popularity</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
