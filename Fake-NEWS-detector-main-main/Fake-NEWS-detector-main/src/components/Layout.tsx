
import React from "react";
import { Outlet } from "react-router-dom";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-factcheck-blue-dark dark:bg-slate-800 text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <MobileNav />
            <Link to="/" className="text-white hover:text-white/90">
              <h1 className="text-2xl font-bold">Fake News Detector</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-factcheck-blue dark:bg-slate-800 py-4 text-white mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Fake News Detector &copy; {new Date().getFullYear()}</p>
          <p className="text-factcheck-blue-light dark:text-blue-300 mt-1">
            Powered by Google Fact Check API
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
