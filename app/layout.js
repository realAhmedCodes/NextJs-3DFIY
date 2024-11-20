import "./globals.css";
import ThemeProviders from "./ThemeProviders";
import Providers from "./Providers";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";
import { CartProvider } from "@/context/CartContext";
import Cart from "./componets/Cart/Cart";

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
              <Navbar />
              <Cart />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </ThemeProviders>
        </Providers>
      </body>
    </html>
  );
}
