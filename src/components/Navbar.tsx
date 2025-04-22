
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="relative group">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">
                <span className="text-trndsky-teal group-hover:text-trndsky-blue transition-colors duration-300">TRND</span>
                <span className="text-trndsky-blue group-hover:text-trndsky-darkblue transition-colors duration-300">SKY</span>
              </span>
            </div>
            <div className="absolute -bottom-1 left-0 h-1 w-0 bg-gradient-to-r from-trndsky-teal to-trndsky-blue group-hover:w-full transition-all duration-500 rounded-full"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <NavLink to="/" currentPath={location.pathname}>الرئيسية</NavLink>
            <NavLink to="/software" currentPath={location.pathname}>البرمجيات الجاهزة</NavLink>
            <NavLink to="/about" currentPath={location.pathname}>من نحن</NavLink>
            <NavLink to="/contact" currentPath={location.pathname}>تواصل معنا</NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-trndsky-blue" />
            ) : (
              <Menu className="h-6 w-6 text-trndsky-blue" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg animate-in slide-in-from-top">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col space-y-4 font-tajawal">
                <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)} currentPath={location.pathname}>
                  الرئيسية
                </MobileNavLink>
                <MobileNavLink to="/software" onClick={() => setIsMenuOpen(false)} currentPath={location.pathname}>
                  البرمجيات الجاهزة
                </MobileNavLink>
                <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)} currentPath={location.pathname}>
                  من نحن
                </MobileNavLink>
                <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)} currentPath={location.pathname}>
                  تواصل معنا
                </MobileNavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, currentPath }: { to: string; children: React.ReactNode; currentPath: string }) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 text-lg font-tajawal transition-all duration-300 group ${
        isActive ? "text-trndsky-teal" : "text-gray-700 hover:text-trndsky-teal"
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-trndsky-teal to-trndsky-blue transform origin-left transition-transform duration-300 ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}></span>
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick, currentPath }: { 
  to: string; 
  children: React.ReactNode;
  onClick: () => void;
  currentPath: string;
}) => {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
        isActive 
          ? "bg-gradient-to-r from-trndsky-teal/10 to-trndsky-blue/10 text-trndsky-blue font-bold"
          : "hover:bg-gray-50"
      }`}
    >
      <span>{children}</span>
      <ChevronDown className={`transform transition-transform duration-300 h-5 w-5 ${isActive ? "rotate-180 text-trndsky-teal" : ""}`} />
    </Link>
  );
};

export default Navbar;
