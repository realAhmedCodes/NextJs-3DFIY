"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  const { userId, email, sellerType, isVerified, sellerId } = useSelector(
    (state) => state.user
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 border border-gray-300 rounded-full px-2 py-1"
      >
        <img
          className="h-8 w-8 rounded-full"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80"
          alt="User"
        />
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
          <ul className="py-2">
            {profileMenuItems.map(({ label, icon: Icon, color }, index) => (
              <li
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

          <div className="hidden md:flex items-center space-x-4">
            <ProfileMenu />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-2 px-2 pt-2 pb-3">
            <NavItem label="Home" href="/" />
            <NavItem label="About" href="/about" />
            <NavItem label="Services" href="/services" />
            <NavItem label="Contact" href="/contact" />
          </div>
          <div className="px-5 py-4 border-t border-gray-200">
            <ProfileMenu />
            <button className="w-full bg-blue-600 text-white mt-3 py-2 rounded-lg">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
