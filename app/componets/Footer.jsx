import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Info */}
          <div className="mb-4 md:mb-0">
            <a href="/" className="text-2xl font-bold text-blue-400">
              YourLogo
            </a>
            <p className="mt-2 text-gray-400">
              Your trusted platform for [brief description]. Providing quality
              services since [year].
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="/" className="hover:text-blue-400">
              Home
            </a>
            <a href="/about" className="hover:text-blue-400">
              About Us
            </a>
            <a href="/services" className="hover:text-blue-400">
              Services
            </a>
            <a href="/contact" className="hover:text-blue-400">
              Contact
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-700"></div>

        {/* Copyright Information */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Built with <span className="text-red-500">&hearts;</span> by
            YourCompany
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
