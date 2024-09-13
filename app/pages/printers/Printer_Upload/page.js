"use client";

import { useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "react-cookie";
//import { jwtDecode, InvalidTokenError } from "jwt-decode";
import { useSelector } from "react-redux";
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
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [checkToken, setCheckToken] = useState("");
  const [printerOwnerId, setPrinterOwnerId] = useState(null);
  const [colors, setColors] = useState([""]);
  const [services, setServices] = useState([""]);

  const { userId, email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );

  setPrinterOwnerId(sellerId)
  useEffect(() => {
    if (printerType) {
      setMaterials(printerOptions[printerType]?.materials || []);
      setSelectedMaterials([]); // Reset selected materials
    } else {
      setMaterials([]);
      setSelectedMaterials([]); // Reset selected materials
    }
  }, [printerType]);

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prevSelectedMaterials) =>
      prevSelectedMaterials.includes(material)
        ? prevSelectedMaterials.filter((m) => m !== material)
        : [...prevSelectedMaterials, material]
    );
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };

  const addColor = () => {
    setColors([...colors, ""]);
  };

  const removeColor = (index) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
  };

  const handleServiceChange = (index, value) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, ""]);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("printer_owner_id", printerOwnerId);
    formData.append("price", price);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("printerType", printerType);
    formData.append("materials", JSON.stringify(selectedMaterials));
    formData.append("colors", JSON.stringify(colors));
    formData.append("services", JSON.stringify(services));
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
            <label>Select Materials</label>
            {materials.map((material, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={material}
                    checked={selectedMaterials.includes(material)}
                    onChange={() => handleMaterialChange(material)}
                  />
                  {material}
                </label>
              </div>
            ))}
          </div>

          <div>
            <label>Colors</label>
            {colors.map((color, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  placeholder="Enter a color"
                />
                <button type="button" onClick={() => removeColor(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addColor}>
              Add Color
            </button>
          </div>

          <div>
            <label>Services</label>
            {services.map((service, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  placeholder="Enter a service"
                />
                <button type="button" onClick={() => removeService(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addService}>
              Add Service
            </button>
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
