// PaymentModal.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "sonner";
const PaymentModal = ({ model, userId, authToken, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          "/api/modelPayment/create-payment-intent",
          {
            modelId: model.model_id,
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        toast.error("Failed to initialize payment.");
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [model.model_id, userId, authToken]);

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    console.log("Card element:", clientSecret);
    

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        toast.error(error.message || "Payment failed.");
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful
        // Call your backend to update the purchase
        try {
          await axios.post(
            "/api/modelPayment/update-purchase",
            {
              modelId: model.model_id,
              userId: userId,
              price: model.price,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          onSuccess();
        } catch (updateError) {
          toast.error("Failed to update purchase.");
          console.error(updateError);
        }
      }
    } catch (error) {
      toast.error("Payment failed.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <DrawerContent>
        <div className="p-4 mb-6 max-w-lg w-full mx-auto">
          <form onSubmit={handleSubmit}>
            <DrawerHeader>
              <DrawerTitle>Complete Purchase</DrawerTitle>
              <DrawerDescription>Enter payment details</DrawerDescription>
            </DrawerHeader>
            <div className="mb-4 p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
            <div className="flex justify-end space-x-2"></div>
            <DrawerFooter>
              <Button type="submit" disabled={!stripe || loading}>
                {loading ? "Processing..." : `Pay $${model.price}`}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </div>
  );
};

export default PaymentModal;
