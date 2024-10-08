import "./globals.css";
import ThemeProviders from "./ThemeProviders";
import Providers from "./Providers";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <ThemeProviders>
           
            {/* This div ensures that the content expands to fill the screen, pushing the footer down */}
            <div className="flex-grow">{children}</div>
          </ThemeProviders>
        </Providers>
        
      </body>
    </html>
  );
}
