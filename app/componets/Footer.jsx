"use client";

import React from "react";
import { navigationLinks } from "../utlits/navigationLinks";
import { Separator } from "@/components/ui/separator";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaDribbble,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary">
      <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center -mx-5 -my-2">
          {navigationLinks.map((link, index) => (
            <div key={index} className="px-5 py-2">
              <a
                href={link.href}
                className="text-base leading-6 text-white hover:text-"
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>

        {/* Social Media Icons */}
        <div className="flex justify-center mt-8 space-x-6">
          <a
            href="#"
            className="text-white hover:text-white"
            aria-label="Facebook"
          >
            <FaFacebookF className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white"
            aria-label="Twitter"
          >
            <FaTwitter className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white"
            aria-label="GitHub"
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-white hover:text-white"
            aria-label="Dribbble"
          >
            <FaDribbble className="w-6 h-6" />
          </a>
        </div>

        {/* Separator */}
        <Separator className="my-6 bg-gray-200" />

        {/* Footer Text */}
        <p className="mt-8 text-base leading-6 text-center text-white">
          &copy; {new Date().getFullYear()} Mercurius Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
