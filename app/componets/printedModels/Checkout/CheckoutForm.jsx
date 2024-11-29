//app/ components/printedModels/Checkout/CheckoutForm.jsx
// app/components/printedModels/Checkout/CheckoutForm.jsx

import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // Import useSelector to get user data

const CheckoutForm = ({ totalPrice, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { clearCart } = useContext(CartContext);
  const router = useRouter();
  const { userId, email } = useSelector((state) => state.user); // Get userId and email from Redux

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post("/api/printedModelsPayment/create-payment-intent", {
          amount: totalPrice,
          items: cartItems,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        setErrorMessage("Failed to initialize payment.");
        console.error(error);
      }
    };

    createPaymentIntent();
  }, [totalPrice, cartItems]);

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
        setErrorMessage(error.message || "Payment failed.");
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful
        // Call your backend to update the purchase
        try {
          await axios.post("/api/printedModelsPayment/update-purchase", {
            items: cartItems,
            totalAmount: totalPrice,
            paymentIntentId: paymentIntent.id,
            userId, // Include userId
            email,   // Include email
          });
          clearCart();
          alert("Success");
          router.push("/thank-you"); // Redirect to a thank you page
        } catch (updateError) {
          setErrorMessage("Failed to update purchase.");
          console.error(updateError);
        }
      }
    } catch (error) {
      setErrorMessage("Payment failed.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          {errorMessage}
        </Alert>
      )}
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
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default CheckoutForm;
