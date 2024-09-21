"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

const UpdatePrinterPage = () => {
  const { printerId } = useParams(); // Get printerId from URL params
  const [printer, setPrinter] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [image, setImage] = useState(null);


  const [location, setLocation] = useState("");
 
  const [printerType, setPrinterType] = useState("");
  const [price, setPrice] = useState("");
 
  const [checkToken, setCheckToken] = useState("");
  const [printerOwnerId, setPrinterOwnerId] = useState(null);
  const router = useRouter();

  // Fetch printer details
  useEffect(() => {
    const fetchPrinterDetail = async () => {
      try {
        const response = await axios.get(
          `/api/printers/${printerId}/printerDetail`
        );
        const data = response.data;
        setPrinter(data);
        setName(data.name);
        setDescription(data.description);
        setMaterials(data.materials || []);
        setLocation(data.location)
        setPrice(data.price)
        setPrinterType(data.printerType)
        setPrinterOwnerId(data.printerOwnerId)
        
        // Set other fields as needed
      } catch (error) {
        console.error("Failed to fetch printer details", error);
      }
    };

    fetchPrinterDetail();
  }, [printerId]);

console.log()



  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("printerId", printerId);
    formData.append("name", name);
    formData.append("description", description);

    // Append other fields as necessary
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`/api/printers/${printerId}/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        console.log("Error updating printer:", data.error);
      } else {
        console.log("Printer updated successfully:", data);
        router.push("/printers"); // Redirect to the printers list page
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="main_div">
      <div className="form_div">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Printer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="materials">Materials</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
            >
              <option value="">Select Material</option>
              {materials.map((material, index) => (
                <option key={index} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="image">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button type="submit">Update Printer</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePrinterPage;
