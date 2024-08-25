"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export const page = () => {
  const [models, setModels] = useState([]);

  const router = useRouter(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/models/getModel");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const modelsData = await response.json();
        console.log(modelsData); // Check the structure of the fetched data

        // Ensure modelsData is an array
        if (Array.isArray(modelsData)) {
          setModels(modelsData);
        } else if (modelsData) {
          // Wrap the single object in an array
          setModels([modelsData]);
        } else {
          console.log("Fetched data is not an array or an object");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Latest Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {models.map((model) => (
          <div
            key={model.model_id}
            /// onClick={() => router.push(`/pages/ModelDetail/${model.model_id}`)}
            //onClick={() => router.push(`/pages/model`)}onClick={() => router.push(`/model/${model.model_id}`)}
            onClick={() => router.push(`/pages/${model.model_id}`)}
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
          >
            <p>{model.name}</p>
            <p>{model.price}</p>
            {model.image && (
              <img
                src={`/uploads/${model.image}`} // Ensure this path matches the actual path to the image in the public folder
                alt={model.name}
                className="w-full h-auto"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
