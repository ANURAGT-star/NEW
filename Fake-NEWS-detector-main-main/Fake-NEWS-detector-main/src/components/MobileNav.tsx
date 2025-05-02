import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  BookOpen, 
  Files, 
  Home, 
  Menu, 
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const MobileNav: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: "/", label: "Home", icon: <Home className="mr-2" size={18} /> },
    { path: "/statistics", label: "Statistics", icon: <BarChart3 className="mr-2" size={18} /> },
    { path: "/resources", label: "Resources", icon: <BookOpen className="mr-2" size={18} /> }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <nav className="flex flex-col gap-4 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? "bg-factcheck-blue text-white dark:bg-blue-800"
                  : "text-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
