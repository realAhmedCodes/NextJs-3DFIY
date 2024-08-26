"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const page = () => {
  const [printers, setPrinters] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/printers/getPrinters");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const Data = await response.json();
     

        // Ensure modelsData is an array
        if (Array.isArray(Data)) {
          setPrinters(Data);
        } else if (Data) {
          // Wrap the single object in an array
          setPrinters([Data]);
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
        {printers.map((printer) => (
          <div
            key={printer.printer_id}
            /// onClick={() => router.push(`/pages/ModelDetail/${model.model_id}`)}
            //onClick={() => router.push(`/pages/model`)}onClick={() => router.push(`/model/${model.model_id}`)}
            onClick={() => router.push(`/pages/printers/${printer.printer_id}/Printer_Detail`)}
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200"
          >
            <p>{printer.name}</p>
            <p>{printer.price}</p>
            {printer.image && (
              <img
                src={`/uploads/${printer.image}`} // Ensure this path matches the actual path to the image in the public folder
                alt={printer.name}
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
