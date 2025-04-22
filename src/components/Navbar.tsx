
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-gradient-to-r from-trndsky-darkblue to-trndsky-blue shadow-lg" 
        : "bg-gradient-to-r from-trndsky-darkblue/90 to-trndsky-blue/90 backdrop-blur-md"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="relative">
              <span className="text-white">
                TRNDSKY
              </span>
              <span className="absolute -top-1 -right-4 bg-gradient-to-r from-trndsky-teal to-trndsky-blue text-white p-1 rounded text-xs">ᐩ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 font-tajawal">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-6 py-2 rounded-full transition-all duration-300 relative ${
                  location.pathname === link.path
                    ? "text-white font-medium"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {location.pathname === link.path && (
                  <span 
                    className="absolute inset-0 bg-white/20 rounded-full -z-10 
                    shadow-lg shadow-trndsky-blue/20"
                  ></span>
                )}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-trndsky-darkblue/95 backdrop-blur-lg shadow-lg animate-in slide-in-from-top border-t border-white/10">
            <div className="container mx-auto p-4">
              <div className="flex flex-col space-y-3 font-tajawal">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      location.pathname === link.path
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const navLinks = [
  { path: "/", label: "الرئيسية" },
  { path: "/software", label: "البرمجيات الجاهزة" },
  { path: "/about", label: "من نحن" },
  { path: "/contact", label: "تواصل معنا" },
];

export default Navbar;
