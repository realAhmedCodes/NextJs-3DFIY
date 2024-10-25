"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ModelSearch() {
  const [models, setModels] = useState([]);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    tags: "",
    sortBy: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories for the filter dropdown
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories/getCategories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get("/api/models/searchModels", {
        params: searchParams,
      });
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Search Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Search 3D Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Keyword Search */}
            <input
              type="text"
              name="keyword"
              placeholder="Search by keyword..."
              value={searchParams.keyword}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />

            {/* Category Filter */}
            <select
              name="category"
              value={searchParams.category}
              onChange={handleInputChange}
              className="border p-2 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={searchParams.minPrice}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={searchParams.maxPrice}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Tags */}
            <input
              type="text"
              name="tags"
              placeholder="Tags (comma-separated)"
              value={searchParams.tags}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />

            {/* Sort By */}
            <select
              name="sortBy"
              value={searchParams.sortBy}
              onChange={handleInputChange}
              className="border p-2 rounded"
            >
              <option value="">Sort By</option>
              <option value="price">Price</option>
              <option value="createdAt">Newest</option>
              <option value="likes_count">Popularity</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        <div>
          {models.length > 0 ? (
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
                    <div className="mt-2">
                      {model.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
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
}
