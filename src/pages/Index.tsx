
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-venti-green-50 dark:from-venti-gray-900 dark:to-venti-green-950/40 p-4">
      <div className={`flex flex-col items-center transition-all duration-1000 ${isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}>
        <div className="w-48 h-48 mb-6 animate-breathe">
          <img 
            src="/lovable-uploads/fa9ac5dd-b695-4d56-803b-1836e56645fb.png" 
            alt="VentiGrow Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <h1 className="venti-logo-text text-4xl font-semibold mb-2 animate-fade-in">
          VentriGrow
        </h1>
        
        <p className="text-venti-gray-600 dark:text-venti-gray-300 text-center max-w-xs animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Smart Agriculture Ventilation System
        </p>
      </div>
    </div>
  );
};

export default Index;
