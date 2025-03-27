
import React from "react";
import { Copyright } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <div className="w-full py-3 px-4 text-center text-xs text-venti-gray-500 dark:text-venti-gray-400 bg-white/80 dark:bg-venti-gray-900/80 backdrop-blur-sm border-t border-border/30">
      <div className="flex items-center justify-center gap-1">
        <Copyright size={14} />
        <span>2025 VentiGrow. All Rights Reserved.</span>
      </div>
    </div>
  );
};

export default Footer;
