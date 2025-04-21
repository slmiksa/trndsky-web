
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-trndsky-blue">
            <span className="text-trndsky-teal">TRND</span>SKY
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/">الرئيسية</NavLink>
            <NavLink to="/software">البرمجيات الجاهزة</NavLink>
            <NavLink to="/about">من نحن</NavLink>
            <NavLink to="/contact">تواصل معنا</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-trndsky-blue" />
              ) : (
                <Menu className="w-6 h-6 text-trndsky-blue" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4 font-tajawal">
            <MobileNavLink to="/" onClick={toggleMenu}>الرئيسية</MobileNavLink>
            <MobileNavLink to="/software" onClick={toggleMenu}>البرمجيات الجاهزة</MobileNavLink>
            <MobileNavLink to="/about" onClick={toggleMenu}>من نحن</MobileNavLink>
            <MobileNavLink to="/contact" onClick={toggleMenu}>تواصل معنا</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link 
      to={to} 
      className="text-gray-700 hover:text-trndsky-teal transition-colors font-medium font-tajawal"
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ 
  to, 
  children, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Link 
      to={to} 
      className="block text-gray-700 hover:text-trndsky-teal py-2 text-right text-lg"
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
