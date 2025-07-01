import { Link } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import NavTab from "./NavTab";
import { navTabs } from "../shared/constants";

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold text-black">
              News Aggregator
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navTabs.map((tab) => (
              <NavTab key={tab.path} path={tab.path} label={tab.label} />
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden ${
            isMobileMenuOpen ? "block border-t border-gray-200" : "hidden"
          }`}
        >
          <div className="flex flex-col space-y-2 py-2">
            {navTabs.map((tab) => (
              <div
                key={tab.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="m-2"
              >
                <NavTab path={tab.path} label={tab.label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
