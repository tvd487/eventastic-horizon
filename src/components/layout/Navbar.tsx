
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface User {
  email: string;
  name?: string;
  role: string | null;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/');
  };

  const navigateToRoleDashboard = () => {
    if (!user?.role) {
      navigate('/select-role');
    } else {
      navigate(`/${user.role}/dashboard`);
    }
  };

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
          
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2"
              >
                <User size={18} />
                <span>{user.name || user.email}</span>
              </Button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50 border">
                  <button
                    onClick={navigateToRoleDashboard}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="border-oceanBlue text-oceanBlue hover:bg-oceanBlue hover:text-white"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                className="bg-oceanBlue hover:bg-oceanBlue-dark text-white"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-gray-700">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link 
                to="/events" 
                className="text-gray-700 hover:text-oceanBlue font-medium py-2"
              >
                Events
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-oceanBlue font-medium py-2"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-oceanBlue font-medium py-2"
              >
                Contact
              </Link>
              
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <div className="mb-4 px-1">
                      <div className="font-medium">{user.name || user.email}</div>
                      <div className="text-sm text-gray-500">{user.role || 'No role selected'}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mb-2"
                      onClick={navigateToRoleDashboard}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-500 border-red-200 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full mb-2 border-oceanBlue text-oceanBlue hover:bg-oceanBlue hover:text-white"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full bg-oceanBlue hover:bg-oceanBlue-dark text-white"
                      onClick={() => navigate('/register')}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
