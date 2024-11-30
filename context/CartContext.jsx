//context/CartContext.jsx
"use client";

import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartItems from sessionStorage if available
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = sessionStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    } else {
      return [];
    }
  });

  // Manage cart visibility state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cartItems to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.printed_model_id === item.printed_model_id
      );
      if (existingItem) {
        // If it's already in the cart, increase the quantity
        return prevItems.map((i) =>
          i.printed_model_id === item.printed_model_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // If it's not in the cart, add it with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.printed_model_id !== itemId)
    );
  };

  // Function to update item quantity
  const updateQuantity = (itemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.printed_model_id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Functions to open and close the cart
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
