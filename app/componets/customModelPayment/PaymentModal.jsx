// PaymentModal.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";

const PaymentModal = ({ model, userId, authToken, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch the clientSecret from your backend
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          "/api/customModelsPayment/create-payment-intent",
          {
            orderId: model.order_id,
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setClientSecret(response.data.clientSecret);
        console.log("Received clientSecret:", response.data.clientSecret);
      } catch (error) {
        toast.error("Failed to initialize payment.");
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [model.order_id, userId, authToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

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
            "/api/customModelsPayment/update-purchase",
            {
              orderId: model.order_id,
              userId: userId,
              price: model.order_file_price,
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Complete Your Purchase</h2>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            {errorMessage}
          </Alert>
        )}
        {clientSecret ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={!stripe || loading}>
                {loading
                  ? "Processing..."
                  : `Pay $${model.order_file_price?.toFixed(2)}`}
              </Button>
            </div>
          </form>
        ) : (
          <p>Loading payment details...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
