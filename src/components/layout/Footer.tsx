
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-oceanBlue" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-oceanBlue to-oceanBlue-dark">
                Eventomorrow
              </span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              Eventomorrow is your all-in-one platform for managing events of any size. From sports to music, investment to technology - we've got you covered.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/events" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Account</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/login" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/organizers" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  For Organizers
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-600 hover:text-oceanBlue transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Eventomorrow. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-sm text-gray-600 hover:text-oceanBlue transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
