"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

// Type definitions
interface Category {
  category_id: number;
  name: string;
}

interface Model {
  model_id: number;
  name: string;
  description: string;
  price: number;
  is_free: boolean;
  image: string;
  tags: string[];
}

interface SearchParams {
  keyword: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  tags: string;
  sortBy: string;
}

const ModelSearch: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
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
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch categories for the filter dropdown
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

  // Debounced search function
  const handleSearch = debounce(async () => {
    setLoading(true);
    try {
      const response = await axios.get<Model[]>("/api/search/searchModels", {
        params: searchParams,
      });
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams((prev) => ({ ...prev, category: value }));

    const suggestions = categories.filter((cat) =>
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setCategorySuggestions(suggestions);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSearchParams((prev) => ({ ...prev, category: categoryName }));
    setCategorySuggestions([]);
  };

  // Execute search on searchParams change
  useEffect(() => {
    handleSearch();
  }, [searchParams]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
            onClick={() => handleSearch()}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 w-full md:w-auto"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        <div>
          {loading ? (
            <div className="text-center text-blue-600 font-semibold text-lg">
              Loading...
            </div>
          ) : models.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div
                  key={model.model_id}
                  className="bg-white border rounded-lg overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition duration-300"
                >
                  {model.image && (
                    <div className="relative h-48 w-full">
                      <img
                        src={`/uploads/${model.image}`}
                        alt={model.name}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{model.name}</h2>
                    <p className="text-lg font-bold text-green-500">
                      {model.is_free ? "Free" : `$${model.price}`}
                    </p>
                    <p className="text-gray-600 mt-2">{model.description}</p>
                    <div className="mt-2 flex flex-wrap">
                      {model.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No models found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelSearch;
