import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface SidebarContextProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Create the context with default values
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

// Define the provider's props
interface SidebarProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ activeTab, setActiveTab, isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the SidebarContext
export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
