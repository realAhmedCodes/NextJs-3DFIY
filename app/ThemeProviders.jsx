'use client';
import { ThemeProvider } from "@material-tailwind/react";

export default function ThemeProviders({ children }) {
 
    return <ThemeProvider>{children}</ThemeProvider>;
}



