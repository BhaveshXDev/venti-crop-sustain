
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Home, Sliders, Settings, User, Leaf, ThermometerSun } from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: <Home size={22} />, label: "Home" },
    { path: "/control", icon: <Sliders size={22} />, label: "Control" },
    { path: "/crops", icon: <Leaf size={22} />, label: "Crops" },
    { path: "/weather", icon: <ThermometerSun size={22} />, label: "Weather" },
    { path: "/profile", icon: <User size={22} />, label: "Profile" },
    { path: "/settings", icon: <Settings size={22} />, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-venti-gray-900/80 backdrop-blur-lg border-t border-border flex justify-around py-2 px-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl transition-colors ${
            isActive(item.path)
              ? "text-venti-green-600 dark:text-venti-green-400"
              : "text-venti-gray-600 dark:text-venti-gray-400 hover:text-venti-green-500 dark:hover:text-venti-green-300"
          }`}
        >
          <div
            className={`mb-0.5 ${
              isActive(item.path) ? "animate-pulse-slow" : ""
            }`}
          >
            {item.icon}
          </div>
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
