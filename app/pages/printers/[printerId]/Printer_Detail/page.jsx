"use client";

import React from "react";
import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Printer_Orders from "@/app/componets/PlaceOrder/Printer_Orders";
import { useSelector } from "react-redux";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Page = () => {
  const { printerId } = useParams();
  const { userId, email, sellerType } = useSelector((state) => state.user);
  const router = useRouter();

  const { data: printer, error } = useSWR(
    printerId ? `/api/printers/${printerId}/printerDetail` : null,
    fetcher
  );

  const updateModelBtn = () => {
    router.push(`/pages/printers/${printerId}/Printer_Update`);
  };

  const delModelBtn = async () => {
    try {
      await axios.delete(`/api/printers/${printerId}/delete`);
      // Optionally, you can redirect or update the UI after deletion
      router.push("/pages/printers");
    } catch (err) {
      console.error("Failed to delete model", err);
    }
  };

  if (!printer && !error) return <div>Loading...</div>;
  if (error) return <div>Error loading printer details</div>;
  if (!printer) return <div>No model found</div>;

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
      <Printer_Orders printerId={printerId} />
    </div>
  );
};

export default Page;
