// components/Cart/Cart.jsx

"use client";

import React, { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Cart ({cartItems.length})</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.printed_model_id} className="mb-4">
                <div className="flex items-center">
                  {item.image ? (
                    <Image
                      src={`/uploads/printedModels/${item.image}`}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200"></div>
                  )}
                  <div className="ml-4">
                    <p className="font-medium">{item.name}</p>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <span>Quantity:</span>
                      <Input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) =>
                          updateQuantity(
                            item.printed_model_id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 ml-2"
                      />
                    </div>
                    <Button
                      variant="link"
                      onClick={() => removeFromCart(item.printed_model_id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <p className="text-lg font-bold">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </div>
            <div className="mt-4">
              <Button variant="primary" className="w-full" href="/checkout">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={clearCart}
              >
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
