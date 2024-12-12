// components/UpdateModelPage.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

const UpdateModelPage = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [designerId, setDesignerId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [selectedSubSubcategoryId, setSelectedSubSubcategoryId] = useState("");

  const [error, setError] = useState("");

  const router = useRouter();

  const { userId } = useSelector((state) => state.user);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubcategories = async () => {
        try {
          const response = await fetch(
            `/api/subcategories/${selectedCategoryId}`
          );
          const subcategoryData = await response.json();
          setSubcategories(subcategoryData);
        } catch (err) {
          console.log(err);
        }
      };
      fetchSubcategories();
      setSelectedSubcategoryId("");
      setSubSubcategories([]);
      setSelectedSubSubcategoryId("");
    } else {
      setSubcategories([]);
      setSubSubcategories([]);
      setSelectedSubcategoryId("");
      setSelectedSubSubcategoryId("");
    }
  }, [selectedCategoryId]);

  // Fetch sub-subcategories when a subcategory is selected
  useEffect(() => {
    if (selectedSubcategoryId) {
      const fetchSubSubcategories = async () => {
        try {
          const response = await fetch(
            `/api/subcategories/${selectedSubcategoryId}`
          );
          const subSubcategoryData = await response.json();
          setSubSubcategories(subSubcategoryData);
        } catch (err) {
          console.log(err);
        }
      };
      fetchSubSubcategories();
      setSelectedSubSubcategoryId("");
    } else {
      setSubSubcategories([]);
      setSelectedSubSubcategoryId("");
    }
  }, [selectedSubcategoryId]);

  // Fetch model details
  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await axios.get(`/api/models/${modelId}/modelDetail`);
        const data = response.data;
        setModel(data);
        setName(data.model_name);
        setDescription(data.description);
        setPrice(data.price);
        setIsFree(data.is_free);
        setTags(data.tags || []);
        setDesignerId(data.designer_id);
        setCategoryId(data.category_id);

        // Fetch category hierarchy based on categoryId
        const categoryHierarchy = await fetchCategoryHierarchy(
          data.category_id
        );
        setSelectedCategoryId(categoryHierarchy.categoryId);
        setSelectedSubcategoryId(categoryHierarchy.subcategoryId);
        setSelectedSubSubcategoryId(categoryHierarchy.subSubcategoryId);
      } catch (error) {
        console.error("Failed to fetch model details", error);
      }
    };

    fetchModelDetail();
  }, [modelId]);

  // Function to fetch category hierarchy
  const fetchCategoryHierarchy = async (categoryId) => {
    try {
      // Fetch the category details
      const response = await fetch(`/api/category/${categoryId}`);
      const categoryData = await response.json();

      if (!categoryData.parent_category_id) {
        // It's a top-level category
        return {
          categoryId: categoryData.category_id.toString(),
          subcategoryId: "",
          subSubcategoryId: "",
        };
      } else {
        // Fetch parent category
        const parentResponse = await fetch(
          `/api/category/${categoryData.parent_category_id}`
        );
        const parentCategoryData = await parentResponse.json();

        if (!parentCategoryData.parent_category_id) {
          // Parent is a top-level category
          return {
            categoryId: parentCategoryData.category_id.toString(),
            subcategoryId: categoryData.category_id.toString(),
            subSubcategoryId: "",
          };
        } else {
          // Parent has a parent, so it's a sub-subcategory
          return {
            categoryId: parentCategoryData.parent_category_id.toString(),
            subcategoryId: parentCategoryData.category_id.toString(),
            subSubcategoryId: categoryData.category_id.toString(),
          };
        }
      }
    } catch (error) {
      console.error("Failed to fetch category hierarchy", error);
      return {
        categoryId: "",
        subcategoryId: "",
        subSubcategoryId: "",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new FormData instance
    const formData = new FormData();
    formData.append("modelId", modelId);
    formData.append(
      "category_id",
      selectedSubSubcategoryId ||
        selectedSubcategoryId ||
        selectedCategoryId ||
        categoryId
    );
    formData.append("designer_id", designerId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", isFree ? "0" : price);
    formData.append("is_free", isFree);

    // Check if image and modelFile are not null
    if (image) {
      formData.append("image", image);
    }
    if (modelFile) {
      formData.append("modelFile", modelFile);
    }

    // Append tags as JSON string
    formData.append("tags", JSON.stringify(tags));

    try {
      // Send PUT request to update model
      const response = await fetch(`/api/models/${modelId}/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        console.log("Error updating model:", data.error);
      } else {
        console.log("Model updated successfully:", data);
        router.push(`/models/${modelId}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
      setError("Update failed. Please try again.");
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput)) {
      if (tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      } else {
        alert("You can only add up to 5 tags.");
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
  };

  return (
    <div>
      <div className="flex justify-center py-8 px-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <h2 className="text-xl font-semibold">Update Your 3D Model</h2>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                {error}
              </Alert>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Model Name */}
              <div>
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter model name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter model description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Category Selection */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => setSelectedCategoryId(value)}
                  value={selectedCategoryId}
                >
                  <SelectTrigger id="category">
                    <span>
                      {selectedCategoryId
                        ? categories.find(
                            (cat) =>
                              cat.category_id.toString() === selectedCategoryId
                          )?.name
                        : "Select a category"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Selection */}
              {subcategories.length > 0 && (
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    onValueChange={(value) => setSelectedSubcategoryId(value)}
                    value={selectedSubcategoryId}
                  >
                    <SelectTrigger id="subcategory">
                      <span>
                        {selectedSubcategoryId
                          ? subcategories.find(
                              (sub) =>
                                sub.category_id.toString() ===
                                selectedSubcategoryId
                            )?.name
                          : "Select a subcategory"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.category_id}
                          value={subcategory.category_id.toString()}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sub-subcategory Selection */}
              {subSubcategories.length > 0 && (
                <div>
                  <Label htmlFor="subsubcategory">Sub-subcategory</Label>
                  <Select
                    onValueChange={(value) =>
                      setSelectedSubSubcategoryId(value)
                    }
                    value={selectedSubSubcategoryId}
                  >
                    <SelectTrigger id="subsubcategory">
                      <span>
                        {selectedSubSubcategoryId
                          ? subSubcategories.find(
                              (subsub) =>
                                subsub.category_id.toString() ===
                                selectedSubSubcategoryId
                            )?.name
                          : "Select a sub-subcategory"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {subSubcategories.map((subsubcategory) => (
                        <SelectItem
                          key={subsubcategory.category_id}
                          value={subsubcategory.category_id.toString()}
                        >
                          {subsubcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Price and Is Free */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFree"
                    checked={isFree}
                    onCheckedChange={(checked) => setIsFree(checked)}
                  />
                  <Label htmlFor="isFree">Is Free</Label>
                </div>
                {!isFree && (
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required={!isFree}
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <Button type="button" onClick={handleTagAdd}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                      <XMarkIcon
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => handleTagDelete(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Model File Upload */}
              <div>
                <Label htmlFor="modelFile">Upload 3D Model (.stl, .obj)</Label>
                <Input
                  id="modelFile"
                  type="file"
                  accept=".stl,.obj"
                  onChange={(e) => setModelFile(e.target.files[0])}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Update Model
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateModelPage;
