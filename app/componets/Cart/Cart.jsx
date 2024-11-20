// components/Cart/Cart.jsx
"use client";

import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    closeCart,
  } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            Review the items in your cart before proceeding to checkout.
          </SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" className="absolute top-4 right-4">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>
        {cartItems.length === 0 ? (
          <p className="p-4">Your cart is empty.</p>
        ) : (
          <div className="p-4 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.printed_model_id}
                className="flex items-center space-x-4"
              >
                {item.image ? (
                  <Image
                    src={`/uploads/printedModels/${item.image}`}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="mr-2">Quantity:</span>
                    <Input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        updateQuantity(
                          item.printed_model_id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-16"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.printed_model_id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="mt-4">
              <p className="text-lg font-bold">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={closeCart}
                as={Link}
                href="/checkout"
              >
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
