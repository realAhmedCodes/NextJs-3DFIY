"use client";

import React, { useState } from "react";

const ModelOrder = ({ printerId }) => {
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [resolution, setResolution] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [fileData, setFileData] = useState(null);
  const [cost, setCost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (e) => {
    setFileData(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fileData ||
      !modelName ||
      !description ||
      !material ||
      !color ||
      !resolution
    ) {
      console.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileData);
    formData.append("modelName", modelName);
    formData.append("description", description);
    formData.append("dimensions", JSON.stringify(dimensions));
    formData.append("material", material);
    formData.append("color", color);
    formData.append("resolution", resolution);
    formData.append("additionalNotes", additionalNotes);

    try {
      const response = await fetch("http://localhost:8001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Error response from server:", errorDetail);
        return;
      }

      const data = await response.json();
      if (data.cost !== undefined) {
        setCost(data.cost);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">3D Model Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="modelName"
            className="block text-sm font-medium text-gray-700"
          >
            Model Name
          </label>
          <input
            type="text"
            id="modelName"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Dimensions (in cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="Length"
              value={dimensions.length}
              onChange={(e) =>
                setDimensions({ ...dimensions, length: e.target.value })
              }
              className="mt-1 block w-full"
            />
            <input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
              className="mt-1 block w-full"
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({ ...dimensions, height: e.target.value })
              }
              className="mt-1 block w-full"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="material"
            className="block text-sm font-medium text-gray-700"
          >
            Material
          </label>
          <select
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="mt-1 block w-full"
            required
          >
            <option value="">Select Material</option>
            <option value="PLA">PLA</option>
            <option value="ABS">ABS</option>
            {/* Add more materials as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <select
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 block w-full"
            required
          >
            <option value="">Select Color</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            {/* Add more colors as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="resolution"
            className="block text-sm font-medium text-gray-700"
          >
            Resolution
          </label>
          <select
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="mt-1 block w-full"
            required
          >
            <option value="">Select Resolution</option>
            <option value="0.10">0.10 mm (Detailed)</option>
            <option value="0.20">0.20 mm (Medium)</option>
            <option value="0.30">0.30 mm (Draft)</option>
            {/* Add more resolutions as needed */}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-gray-700"
          >
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="modelFile"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Reference File (optional)
          </label>
          <input
            type="file"
            id="modelFile"
            onChange={handleFileChange}
            accept=".jpg,.png,.pdf"
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-md py-2 px-4 bg-[#539e60] text-sm font-medium text-white"
        >
          Submit Order
        </button>
      </form>
      {cost !== null && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">
            Estimated Cost: ${cost.toFixed(2)}
          </h3>
        </div>
      )}
    </div>
  );
};

export default ModelOrder;
