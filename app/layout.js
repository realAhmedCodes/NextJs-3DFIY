import "./globals.css";
import ThemeProviders from "./ThemeProviders";
import Providers from "./Providers";
import { CartProvider } from "@/context/CartContext";
import Cart from "./componets/Cart/Cart";
import { Toaster } from "@/components/ui/sonner";
import ClientLayoutContent from "./ClientLayoutContent";

export const metadata = {
  title: "3D Models Marketplace",
  description: "Buy and sell 3D printed models.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <ThemeProviders>
            <CartProvider>
              <Cart />
              <ClientLayoutContent>{children}</ClientLayoutContent>
              <Toaster position="top-right" />
            </CartProvider>
          </ThemeProviders>
        </Providers>
      </body>
    </html>
  );
}
