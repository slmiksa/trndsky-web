
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-trndsky-blue flex items-center gap-2">
            TRNDSKY
            <span className="bg-trndsky-blue text-white p-1 rounded text-sm">ᐩ</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 font-tajawal">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-trndsky-blue text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg animate-in slide-in-from-top">
            <div className="container mx-auto p-4">
              <div className="flex flex-col space-y-2 font-tajawal">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      location.pathname === link.path
                        ? "bg-trndsky-blue text-white"
                        : "hover:bg-gray-100"
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
