"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode correctly
import axios from "axios";
import { useParams } from "next/navigation";

const page = () => {
  const { printerId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [isLiked, setIsLiked] = useState(null);
  const [isSaved, setIsSaved] = useState(null);
  const [userId, setUserId] = useState(null);
  const [printer, setPrinter] = useState(null);
  const [sellerType, setSellerType] = useState("");
  console.log("idddd", printerId);
  useEffect(() => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      setCheckToken(token);
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.user_id);
        setSellerType(decodedToken.sellerType);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchModelDetail = async () => {
      try {
        const response = await fetch(
          `/api/printers/${printerId}/printerDetail`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch model details");
        }
        const data = await response.json();
        setPrinter(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModelDetail();
  }, [printerId]);


  
  const updateModelBtn = () => {
    nav.push(`/pages/${modelId}/updateModel`);
  };

  const delModelBtn = async () => {
    try {
      // Replace with actual user ID or a variable containing it

      const payload = { user_id: userId, modelId: modelId };

      await axios.delete(
        `/api/models/delete?user_id=${userId}&model_id=${modelId}`
      );
    } catch (err) {
      console.error("Failed to update like status", err);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!printer) {
    return <div>No model found</div>;
  }

  console.log(printer);
  const profilePicFilename = printer.profile_pic.split("\\").pop();
  const profilePicPath = `/uploads/${profilePicFilename}`;
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{printer.user_name}</h1>
            <div className="flex items-center">
              {printer.profile_pic && (
                <img
                  src={profilePicPath}
                  alt={printer.user_name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <h2 className="text-lg">{printer.user_location}</h2>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{printer.description}</p>
          <div className="mb-4">
            {printer.image && (
              <img
                src={`/uploads/${printer.image}`}
                alt={printer.name}
                className="w-full h-auto"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
           
            {sellerType === "Printer Owner" && (
              <div>
                <button onClick={updateModelBtn}>Update Model</button>
                <button onClick={delModelBtn}>Delete Model</button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
