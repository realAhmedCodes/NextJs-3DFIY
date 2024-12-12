"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PrinterUploadForm from "@/components/printer-upload-form";

const Page = () => {
  const [printerOwnerId, setPrinterOwnerId] = useState(null);
  const { sellerId } = useSelector((state: { user: { sellerId: string | number } }) => state.user);

  useEffect(() => {
    if (sellerId) {
      setPrinterOwnerId(sellerId);
    }
  }, [sellerId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PrinterUploadForm initialSellerId={sellerId} />
    </div>
  );
};

export default Page;
