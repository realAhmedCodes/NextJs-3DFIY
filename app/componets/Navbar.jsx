"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Extract user data from Redux state
  const { userId, email, profile_pic, sellerType } = useSelector(
    (state) => state.user
  );

  // Logout function
  const logout = () => {
    window.localStorage.clear("token");
    router.push("/pages/Login");
  };

  // Main navigation links
  const navigationLinks = [
    { label: "Home", href: "/" },
    {
      label: "Hire Designers",
      href: "/pages/users/userProfiles/designers",
    },
    { label: "3D Printers", href: "/pages/printers/ViewPrinter" },
    { label: "Buy 3D Models", href: "/pages/ViewModels" },
  ];

  // Profile menu items
  const profileMenuItems = [
    { label: "My Profile", href: `/pages/users/${userId}/profile` },
    { label: "Edit Profile", href: `/pages/users/${userId}/editProfile` },
    { label: "Inbox", href: `/pages/users/${userId}/inbox` },
  ];

  // Conditionally add "Upload Model" or "Upload Printer" based on sellerType
  if (sellerType === "Designer") {
    profileMenuItems.push({
      label: "Upload Model",
      href: `/pages/Model_Upload`,
    });
  } else if (sellerType === "Printer Owner") {
    profileMenuItems.push({
      label: "Upload Printer",
      href: `/pages/printers/UploadPrinter`,
    });
  }

  // Add the "Sign Out" option
  profileMenuItems.push({
    label: "Sign Out",
    onClick: logout,
    color: "text-red-500",
  });

  return (
    <nav className="bg-white shadow-md fixed w-full z-50 border-b border-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 hover:opacity-80 transition-opacity"
            >
              3Dify
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map(({ label, href }, index) => (
              <Link
                key={index}
                href={href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 ease-in-out font-medium text-lg"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
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
                        <AvatarFallback className="text-white bg-blue-500">
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
              <Button
                variant="outline"
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-200 ease-in-out font-medium"
                onClick={() => router.push("/pages/Login")}
              >
                Login
              </Button>
            )}
          </div>

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
                  router.push("/pages/login");
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
