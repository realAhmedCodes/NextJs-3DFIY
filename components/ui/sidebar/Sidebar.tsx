import React from "react";
import { useSidebar } from "./SidebarContext";
import { Home, List, ShoppingCart, ShoppingBag, Menu } from "lucide-react"; // Example icons from lucide-react
import { Button } from "@/components/ui/button";
import clsx from "clsx"; // For conditional classNames

// Define the props for SidebarItem
interface SidebarItemProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

// Mapping icon names to actual icon components
const iconMap: { [key: string]: JSX.Element } = {
  home: <Home className="w-5 h-5" />,
  pending: <List className="w-5 h-5" />,
  active: <ShoppingCart className="w-5 h-5" />,
  models: <ShoppingBag className="w-5 h-5" />,
};

// SidebarItem Component
export const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center p-2 rounded-md hover:bg-gray-200 transition-colors",
        active ? "bg-gray-300 font-semibold" : ""
      )}
    >
      {iconMap[icon]}
      <span className="ml-3">{label}</span>
    </button>
  );
};

// Sidebar Component
interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, children }) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};

// SidebarTrigger Component for Mobile Navigation
export const SidebarTrigger: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200">
      <Menu className="w-6 h-6" />
    </Button>
  );
};
