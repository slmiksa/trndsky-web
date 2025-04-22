
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold relative group">
            <span className="text-trndsky-teal group-hover:text-trndsky-blue transition-colors duration-300">TRND</span>
            <span className="text-trndsky-blue group-hover:text-trndsky-darkblue transition-colors duration-300">SKY</span>
            <div className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-trndsky-teal to-trndsky-blue group-hover:w-full transition-all duration-500 rounded-full"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 lg:space-x-2">
            <NavLink to="/" currentPath={location.pathname}>الرئيسية</NavLink>
            <NavLink to="/software" currentPath={location.pathname}>البرمجيات الجاهزة</NavLink>
            <NavLink to="/about" currentPath={location.pathname}>من نحن</NavLink>
            <NavLink to="/contact" currentPath={location.pathname}>تواصل معنا</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="focus:outline-none hover:text-trndsky-teal transition-colors"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg animate-slide-in">
          <div className="container mx-auto px-6 py-6 flex flex-col space-y-4 font-tajawal">
            <MobileNavLink to="/" onClick={toggleMenu} currentPath={location.pathname}>الرئيسية</MobileNavLink>
            <MobileNavLink to="/software" onClick={toggleMenu} currentPath={location.pathname}>البرمجيات الجاهزة</MobileNavLink>
            <MobileNavLink to="/about" onClick={toggleMenu} currentPath={location.pathname}>من نحن</MobileNavLink>
            <MobileNavLink to="/contact" onClick={toggleMenu} currentPath={location.pathname}>تواصل معنا</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, currentPath }: { to: string; children: React.ReactNode; currentPath: string }) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-full text-lg transition-all duration-300 relative font-tajawal ${
        isActive 
          ? "text-trndsky-teal font-bold bg-trndsky-blue/5" 
          : "text-gray-700 hover:text-trndsky-teal"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-trndsky-teal rounded-full"></span>
      )}
    </Link>
  );
};

const MobileNavLink = ({ 
  to, 
  children, 
  onClick,
  currentPath
}: { 
  to: string; 
  children: React.ReactNode;
  onClick: () => void;
  currentPath: string;
}) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      className={`block text-right text-xl py-3 px-4 rounded-lg transition-all duration-200 ${
        isActive 
          ? "bg-gradient-to-r from-trndsky-blue/10 to-trndsky-teal/10 text-trndsky-blue font-bold" 
          : "text-gray-700 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-end items-center gap-3">
        {children}
        <ChevronDown className={`h-5 w-5 transition-transform ${isActive ? "rotate-180 text-trndsky-teal" : ""}`} />
      </div>
    </Link>
  );
};

export default Navbar;
