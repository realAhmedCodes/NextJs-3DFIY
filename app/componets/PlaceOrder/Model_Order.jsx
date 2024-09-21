"use client";

import React, { useState } from "react";

const ModelOrder = ({ sellerId, userId }) => {
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [fileFormat, setFileFormat] = useState("");
  const [referenceFile, setReferenceFile] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setReferenceFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !modelName ||
      !description ||
      !dimensions.length ||
      !dimensions.width ||
      !dimensions.height ||
      !fileFormat
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("modelName", modelName);
    formData.append("description", description);
    formData.append("dimensions", JSON.stringify(dimensions));
    formData.append("fileFormat", fileFormat);
    formData.append("referenceFile", referenceFile);
    formData.append("additionalNotes", additionalNotes);
    
    formData.append("userId", userId);

    try {
      const response = await fetch(`/api/orders/ModelOrders/${sellerId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const result = await response.json();
      console.log("Order submitted successfully", result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">3D Model Order Form</h2>
      {error && <div className="text-red-500">{error}</div>}
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
              required
            />
            <input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
              className="mt-1 block w-full"
              required
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({ ...dimensions, height: e.target.value })
              }
              className="mt-1 block w-full"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="fileFormat"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred File Format
          </label>
          <select
            id="fileFormat"
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
            className="mt-1 block w-full"
            required
          >
            <option value="">Select File Format</option>
            <option value="stl">STL</option>
            <option value="obj">OBJ</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="referenceFile"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Reference File (optional)
          </label>
          <input
            type="file"
            id="referenceFile"
            onChange={handleFileChange}
            accept=".stl,.obj"
            className="mt-1 block w-full"
          />
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
        <button
          type="submit"
          className="mt-4 rounded-md py-2 px-4 bg-[#539e60] text-sm font-medium text-white"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
};

export default ModelOrder;
