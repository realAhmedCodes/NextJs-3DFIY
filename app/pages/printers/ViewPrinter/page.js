"use client";
import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { data: printers, error } = useSWR(
    "/api/printers/getPrinters",
    fetcher
  );
  const router = useRouter();

  if (error) return <div>Error loading printers</div>;
  if (!printers) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Latest Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {printers.map((printer) => (
          <div
            key={printer.printer_id}
            onClick={() =>
              router.push(
                `/pages/printers/${printer.printer_id}/Printer_Detail`
              )
            }
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

export default Page;
