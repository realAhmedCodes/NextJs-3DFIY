"use client";

import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayoutContent({ children }) {
  const pathname = usePathname();

  // Define paths where Navbar and Footer should be hidden
  const noLayoutPaths = ["/pages/Login", "/pages/register"];
  const shouldShowLayout = !noLayoutPaths.includes(pathname);

  return (
    <>
      {shouldShowLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {shouldShowLayout && <Footer />}
    </>
  );
}
