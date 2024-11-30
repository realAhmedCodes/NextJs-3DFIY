// components/PurchaseModal.jsx

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import axios from "axios";
import stripePromise from "@/lib/stripe";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const PurchaseModal = ({ isOpen, onClose, modelId, modelPrice }) => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);

  const router = useRouter();
  const { userId, authToken } = useSelector((state) => state.user);

  const handleBuy = async () => {
    if (!userId) {
      // Redirect to login or show a message
      router.push("/login");
      return;
    }

    setPurchaseLoading(true);
    setPurchaseError(null);

    try {
      const response = await axios.post(
        "/api/create-checkout-session",
        { modelId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Replace with your auth mechanism
          },
        }
      );

      const { sessionId } = response.data;

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        setPurchaseError(error.message);
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
      setPurchaseError(
        err.response?.data?.error ||
          "Failed to initiate purchase. Please try again."
      );
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Model</DialogTitle>
          <DialogDescription>
            Enter your payment details to purchase this model for ${modelPrice}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {/* You can integrate Stripe Elements here for custom payment forms */}
          {/* For simplicity, we'll use a button to initiate Stripe Checkout */}
          <Button
            onClick={handleBuy}
            disabled={purchaseLoading}
            className="w-full"
          >
            {purchaseLoading ? "Processing..." : `Buy Now for $${modelPrice}`}
          </Button>
          {purchaseError && (
            <Alert variant="destructive" className="mt-4">
              {purchaseError}
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
