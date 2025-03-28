
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 px-4 text-center text-xs text-venti-gray-500 dark:text-venti-gray-400 mt-auto">
      <p>© {currentYear} VentriGrow. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
