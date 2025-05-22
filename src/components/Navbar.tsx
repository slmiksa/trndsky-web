
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
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/494b749b-6590-48df-b844-3fd9b22b299f.png" 
              alt="TRNDSKY Logo" 
              className="h-16 animate-pulse-soft" 
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 font-tajawal space-x-6">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`transition-all duration-300 relative group ${
                  location.pathname === link.path 
                    ? "text-trndsky-blue font-medium" 
                    : "text-gray-600 hover:text-trndsky-blue"
                }`}
              >
                <span className="block px-3 py-2 text-lg font-extrabold">
                  {link.label}
                </span>
                <span className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-trndsky-blue to-trndsky-yellow rounded-full transition-all duration-300 ${
                  location.pathname === link.path ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 rounded-lg bg-trndsky-blue/10 hover:bg-trndsky-blue/20 text-trndsky-blue transition-colors" 
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top">
            <div className="container mx-auto p-4">
              <div className="flex flex-col space-y-3 font-tajawal">
                {navLinks.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`p-4 rounded-lg transition-all duration-300 hover-lift ${
                      location.pathname === link.path 
                        ? "bg-trndsky-blue/10 text-trndsky-blue font-medium" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-trndsky-blue"
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
  {
    path: "/",
    label: "الرئيسية"
  }, 
  {
    path: "/software",
    label: "البرمجيات الجاهزة"
  }, 
  {
    path: "/partners",
    label: "شركاء النجاح"
  }, 
  {
    path: "/about",
    label: "من نحن"
  }, 
  {
    path: "/contact",
    label: "تواصل معنا"
  }
];

export default Navbar;
