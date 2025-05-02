import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  BookOpen, 
  Files, 
  Home, 
  Search
} from "lucide-react";

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/ml", label: "ML Detector", icon: <Search size={18} /> },
    { path: "/statistics", label: "Statistics", icon: <BarChart3 size={18} /> },
    { path: "/resources", label: "Resources", icon: <BookOpen size={18} /> }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-factcheck-blue text-white dark:bg-blue-800"
              : "text-white/80 hover:text-white hover:bg-factcheck-blue/80 dark:hover:bg-blue-800/80"
          }`}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
