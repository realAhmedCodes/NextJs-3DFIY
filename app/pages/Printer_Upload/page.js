"use client";

import { useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "react-cookie";
import { jwtDecode, InvalidTokenError } from "jwt-decode";

const printerOptions = {
  FDM: {
    name: "Fused Deposition Modeling",
    materials: [
      "PLA (Polylactic Acid)",
      "ABS (Acrylonitrile Butadiene Styrene)",
      "PETG (Polyethylene Terephthalate Glycol-modified)",
      "TPU (Thermoplastic Polyurethane)",
      "Nylon",
    ],
  },
  SLA: {
    name: "Stereolithography",
    materials: [
      "Standard Resin",
      "Tough Resin",
      "Flexible Resin",
      "Castable Resin",
    ],
  },
  SLS: {
    name: "Selective Laser Sintering",
    materials: [
      "Nylon (Polyamide)",
      "TPU (Thermoplastic Polyurethane)",
      "Glass-Filled Nylon",
      "Alumide",
    ],
  },
  DLP: {
    name: "Digital Light Processing",
    materials: ["Standard Resin", "Tough Resin", "Flexible Resin"],
  },
};

const Page = () => {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [printerType, setPrinterType] = useState("");
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [checkToken, setCheckToken] = useState("");
  const [printerOwnerId, setPrinterOwnerId] = useState(null);

  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    console.log(token);
    setCheckToken(token || "");
    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        const sellerId = decodedToken.seller_id;
        setPrinterOwnerId(sellerId);
        console.log(decodedToken.user_id);
      }
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    // Update the materials dropdown when printer type changes
    if (printerType) {
      setMaterials(printerOptions[printerType]?.materials || []);
    } else {
      setMaterials([]);
    }
  }, [printerType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("printer_owner_id", printerOwnerId);
    formData.append("price", price);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("printerType", printerType);
    formData.append("material", selectedMaterial);
    formData.append("location", location);
    formData.append("image", image);

    try {
      const response = await fetch("/api/printers/printerUpload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        console.log(data.error);
      } else {
        console.log("Printer uploaded successfully:", data);
      }
    } catch (error) {
      console.error(error);
      console.log("Server Error");
    }
  };

  return (
    <div className="main_div">
      <div className="form_div">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Enter Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description">Enter Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="location">Enter Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="printerType">Select Printer Type</label>
            <select
              value={printerType}
              onChange={(e) => setPrinterType(e.target.value)}
            >
              <option value="">Select a Printer Type</option>
              {Object.keys(printerOptions).map((type) => (
                <option key={type} value={type}>
                  {printerOptions[type].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="material">Select Material</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              disabled={!materials.length}
            >
              <option value="">Select a Material</option>
              {materials.map((material, index) => (
                <option key={index} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price">Enter Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image">Upload Image</label>
            <input
              accept="image/jpeg,image/png"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button type="submit">Upload Printer</button>
        </form>
      </div>
    </div>
  );
};

export default Page;
