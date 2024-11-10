"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
<<<<<<< Updated upstream
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const profileMenuItems = [
  { label: "My Profile", icon: UserCircleIcon },
  { label: "Edit Profile", icon: Cog6ToothIcon },
  { label: "Inbox", icon: InboxArrowDownIcon },
  { label: "Sign Out", icon: ArrowRightOnRectangleIcon, color: "text-red-500" },
];

const NavItem = ({ label, href }) => (
  <a
    href={href}
    className="text-gray-900 hover:text-blue-500 font-medium px-3 py-2"
  >
    {label}
  </a>
);

const ProfileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

=======
import { Menu, X, ChevronDown, Printer } from "lucide-react";
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
>>>>>>> Stashed changes
  const router = useRouter();

  const { userId, email, profile_pic, sellerType } = useSelector(
    (state) => state.user
  );

  const logout = () => {
    window.localStorage.clear("token");
    router.push("/pages/Login");
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    {
      label: "Hire Designers",
      href: "/pages/users/userProfiles/designers",
    },
    { label: "3D Printers", href: "/pages/printers/ViewPrinter" },
    { label: "Buy 3D Models", href: "/pages/ViewModels" },
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
      href: `/pages/printers/UploadPrinter`,
    });
  }

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
                className="px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Icon className={`h-5 w-5 ${color || "text-gray-700"}`} />
                <span
                  className={`text-sm font-medium ${color || "text-gray-700"}`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
<<<<<<< Updated upstream
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              Logo
            </a>
            <div className="hidden md:flex ml-10 space-x-4">
              <NavItem label="Home" href="/" />
              <NavItem label="About" href="/about" />
              <NavItem label="Services" href="/services" />
              <NavItem label="Contact" href="/contact" />
            </div>
          </div>

=======
    <nav className="bg-white shadow-md w-full border-b border-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-center">
              <Printer className="h-6 w-6 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">3Dify</span>
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            <ProfileMenu />
            <button className="w-full bg-blue-600 text-white mt-3 py-2 rounded-lg">
              Login
            </button>
=======
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
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/pages/Login");
                }}
              >
                Login
              </Button>
            )}
>>>>>>> Stashed changes
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
