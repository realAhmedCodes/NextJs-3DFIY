// app/components/Reviews.jsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const Reviews = ({ profileId, printerId }) => {
  const { userId, email, sellerType } = useSelector((state) => state.user);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const toast = useToast();
let parsedProfileId= parseInt(profileId)
let parsedPrinterId= parseInt(printerId)
  const handleReviewSubmit = async () => {
    // Validate that either profileId or printerId is provided
    if (!profileId && !printerId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No target for the review.",
      });
      return;
    }

    // Validate that review text is not empty
    if (!reviewText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please write a review before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews/postReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          profileId: parsedProfileId || null,
          printerId: parsedPrinterId || null,
          reviewText,
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          variant: "default",
          title: "Success",
          description: "Your review has been posted!",
        });
        setReviewText("");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to post review.",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      {/* User Interaction Section */}
      <Card className="p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Share Your Thoughts
        </h2>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write a comment..."
          className="mb-4 border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          rows={4}
        />
        <Button
          variant="primary"
          onClick={handleReviewSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </Card>
    </div>
  );
};

export default Reviews;
