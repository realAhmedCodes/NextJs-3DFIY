// app/pages/checkout/page.jsx

"use client";

import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Import Stripe elements
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/app/componets/printedModels/Checkout/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <p>Your cart is empty.</p>
        <Button variant="primary" onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.printed_model_id} className="flex items-center mb-2">
            <p className="flex-1">{item.name}</p>
            <p>
              {item.quantity} x ${item.price.toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex items-center font-bold">
          <p className="flex-1">Total:</p>
          <p>${totalPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Optional: Collect Shipping Information */}
      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
        <Input placeholder="Full Name" className="mb-2" />
        <Input placeholder="Address" className="mb-2" />
        <Input placeholder="City" className="mb-2" />
        <Input placeholder="Postal Code" className="mb-2" />
        <Input placeholder="Country" className="mb-2" />
      </div> */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Payment</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm totalPrice={totalPrice} cartItems={cartItems} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
