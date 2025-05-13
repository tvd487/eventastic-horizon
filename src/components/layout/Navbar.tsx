
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, Search } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-oceanBlue" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-oceanBlue to-oceanBlue-dark">
            Eventomorrow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/events" className="text-gray-700 hover:text-oceanBlue font-medium transition-colors">
            Events
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-oceanBlue font-medium transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-oceanBlue font-medium transition-colors">
            Contact
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-oceanBlue text-oceanBlue hover:bg-oceanBlue hover:text-white">
              Login
            </Button>
            <Button className="bg-oceanBlue hover:bg-oceanBlue-dark text-white">
              Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t absolute w-full shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link 
              to="/events" 
              className="text-gray-700 hover:text-oceanBlue font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-oceanBlue font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-oceanBlue font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
              <Button variant="outline" className="border-oceanBlue text-oceanBlue hover:bg-oceanBlue hover:text-white w-full">
                Login
              </Button>
              <Button className="bg-oceanBlue hover:bg-oceanBlue-dark text-white w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
