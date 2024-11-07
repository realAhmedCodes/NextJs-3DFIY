// components/ModelUploadPage.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

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
import { Plus, X } from "lucide-react";

const ModelUploadPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [selectedSubSubcategoryId, setSelectedSubSubcategoryId] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [designerId, setDesignerId] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const { sellerId } = useSelector((state) => state.user);

  useEffect(() => {
    if (sellerId) {
      setDesignerId(sellerId);
    }
  }, [sellerId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category"); // Ensure endpoint consistency
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !modelFile || !image || !selectedCategoryId) {
      setError("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "category_id",
      selectedSubSubcategoryId || selectedSubcategoryId || selectedCategoryId
    );
    formData.append("designer_id", designerId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", isFree ? 0 : price);
    formData.append("is_free", isFree);
    formData.append("image", image);
    formData.append("tags", JSON.stringify(tags));
    formData.append("modelFile", modelFile);

    try {
      const response = await fetch("/api/models/modelUpload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        console.log("Model uploaded successfully:", data);
        
      }
    } catch (error) {
      console.error(error);
      setError("Server Error. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center py-8 px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <h2 className="text-xl font-semibold">Upload Your 3D Model</h2>
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
                onValueChange={setSelectedCategoryId}
                value={selectedCategoryId}
              >
                <SelectTrigger id="category">
                  <span>
                    {selectedCategoryId
                      ? categories.find(
                          (cat) => cat.category_id === selectedCategoryId
                        )?.name
                      : "Select a category"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id}
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
                  onValueChange={setSelectedSubcategoryId}
                  value={selectedSubcategoryId}
                >
                  <SelectTrigger id="subcategory">
                    <span>
                      {selectedSubcategoryId
                        ? subcategories.find(
                            (sub) => sub.category_id === selectedSubcategoryId
                          )?.name
                        : "Select a subcategory"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem
                        key={subcategory.category_id}
                        value={subcategory.category_id}
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
                  onValueChange={setSelectedSubSubcategoryId}
                  value={selectedSubSubcategoryId}
                >
                  <SelectTrigger id="subsubcategory">
                    <span>
                      {selectedSubSubcategoryId
                        ? subSubcategories.find(
                            (subsub) =>
                              subsub.category_id === selectedSubSubcategoryId
                          )?.name
                        : "Select a sub-subcategory"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {subSubcategories.map((subsubcategory) => (
                      <SelectItem
                        key={subsubcategory.category_id}
                        value={subsubcategory.category_id}
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
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                    <X
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
                required
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
                required
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Upload Model
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelUploadPage;
