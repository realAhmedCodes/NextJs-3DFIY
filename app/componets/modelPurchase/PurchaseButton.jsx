// components/PurchaseButton.jsx
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import stripePromise from "@/lib/stripe";
import { useRouter } from "next/navigation";

const PurchaseButton = ({ modelId, authToken, hasPurchased, isFree }) => {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const router = useRouter();

  const handleBuy = async () => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    setPurchaseLoading(true);
    setPurchaseError(null);

    try {
      const response = await axios.post(
        "/api/create-checkout-session",
        {
          modelId: modelId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setPurchaseError("Failed to initiate purchase. Please try again.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleDownload = () => {
    router.push(`/api/download?modelId=${modelId}`);
  };

  return (
    <div className="mt-4">
      {isFree ? (
        <Button onClick={handleDownload}>Download Now</Button>
      ) : hasPurchased ? (
        <Button onClick={handleDownload}>Download</Button>
      ) : (
        <Button onClick={handleBuy} disabled={purchaseLoading}>
          {purchaseLoading ? "Processing..." : "Buy Now"}
        </Button>
      )}

      {purchaseError && (
        <Alert variant="destructive" className="mt-2">
          {purchaseError}
        </Alert>
      )}
    </div>
  );
};

export default PurchaseButton;
