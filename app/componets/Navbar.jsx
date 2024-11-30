"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, Printer } from "lucide-react";
import Image from "next/image";
import { CartContext } from "@/context/CartContext";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Notifications from "./Notifications/Notifications";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { userId, email, profile_pic, sellerType } = useSelector(
    (state) => state.user
  );
  const { cartItems, openCart } = useContext(CartContext);

  const logout = () => {
    window.localStorage.clear("token");
    toast.success("Logout successful");
    router.push("/pages/Login");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    {
      label: "Hire Designers",
      href: "/pages/users/userProfiles/designers",
    },
    { label: "3D Printers", href: "/pages/printers/ViewPrinter" },
    { label: "Buy 3D Models", href: "/pages/ViewModels" },
    {
      label: "Buy Printed Models",
      href: "/pages/printedModels/viewPrintedModels",
    },
  ];

  // Determine the profile URL based on sellerType
  const profileUrl =
    sellerType === "Regular"
      ? `/pages/users/${userId}/UserProfile`
      : `/pages/users/${userId}/profile`;

  const profileMenuItems = [
    { label: "My Profile", href: profileUrl },
    { label: "Edit Profile", href: `/pages/users/${userId}/editProfile` },
    { label: "Inbox", href: `/pages/users/${userId}/inbox` },
  ];

  // Additional items based on sellerType
  if (sellerType === "Designer") {
    profileMenuItems.push({
      label: "Upload Model",
      href: `/pages/Model_Upload`,
    });
  } else if (sellerType === "Printer Owner") {
    profileMenuItems.push({
      label: "Upload Printer",
      href: `/pages/printers/Printer_Upload`,
    });
  }

  profileMenuItems.push({
    label: "Sign Out",
    onClick: logout,
    color: "text-red-500",
  });

  return (
    <nav className="bg-white shadow-md relative w-full z-50 border-b border-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center">
              <img src="/3dify.png" className="w-44" alt="3Dify Logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map(({ label, href }, index) => (
              <Link
                key={index}
                href={href}
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 hover:text-blue-600 transition-colors duration-200 ease-in-out"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User Menu */}

          <>
            <Button
              variant="outline"
              onClick={openCart}
              className="flex items-center"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart ({cartItems.length})
            </Button>
<div><Notifications></Notifications></div>
            <div className="hidden md:flex items-center space-x-4">
              {userId ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <Avatar className="h-10 w-10 rounded-full shadow-lg">
                        {profile_pic ? (
                          <AvatarImage
                            src={`/uploads/${profile_pic}`}
                            alt="User Avatar"
                          />
                        ) : (
                          <AvatarFallback className="text-white bg-primary">
                            {email ? email.charAt(0).toUpperCase() : "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-md shadow-lg mt-2 bg-white"
                  >
                    {profileMenuItems.map(
                      ({ label, href, onClick, color }, index) => (
                        <DropdownMenuItem
                          key={index}
                          className={`${
                            color || "text-gray-700"
                          } hover:bg-gray-100 rounded-md transition-colors duration-200 ease-in-out px-4 py-2`}
                          onClick={() => {
                            if (onClick) {
                              onClick();
                            } else {
                              router.push(href);
                            }
                          }}
                        >
                          {label}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>Get Started</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Button
                          className="w-full"
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("/pages/Login")}
                        >
                          Login
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push("/pages/register")}
                          size="sm"
                        >
                          Get Started
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationLinks.map(({ label, href }, index) => (
              <Link
                key={index}
                href={href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-200">
            {userId ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 w-full focus:outline-none">
                    <Avatar className="h-8 w-8 rounded-full shadow">
                      {profile_pic ? (
                        <AvatarImage
                          src={`/uploads/${profile_pic}`}
                          alt="User Avatar"
                        />
                      ) : (
                        <AvatarFallback>
                          {email ? email.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="rounded-md shadow-lg"
                >
                  {profileMenuItems.map(
                    ({ label, href, onClick, color }, index) => (
                      <DropdownMenuItem
                        key={index}
                        className={`${
                          color || "text-gray-700"
                        } hover:bg-gray-100 rounded-md transition-colors duration-200 ease-in-out`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (onClick) {
                            onClick();
                          } else {
                            router.push(href);
                          }
                        }}
                      >
                        {label}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 ease-in-out"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/pages/Login");
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
