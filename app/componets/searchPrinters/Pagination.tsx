// components/ui/Pagination.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages === 0) return null;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and two neighbors
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={index} className="px-3 py-2 text-gray-700">
              ...
            </span>
          );
        } else {
          return (
            <Button
              key={index}
              variant={page === currentPage ? "ghost" : "outline"}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 ${
                page === currentPage
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-green-600 hover:text-white"
              }`}
            >
              {page}
            </Button>
          );
        }
      })}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
