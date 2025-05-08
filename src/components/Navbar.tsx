
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
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 
      ${scrolled ? "bg-white shadow-md" : "bg-white"}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-2xl font-bold text-trndsky-darkblue flex items-center gap-2">
            <div className="relative">
              <span>TRNDSKY</span>
              <span className="absolute -top-1 -right-4 bg-gradient-to-r from-trndsky-teal to-trndsky-blue text-white p-1 rounded text-sm">ᐩ</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 font-tajawal space-x-6">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`transition-all duration-300 relative group ${location.pathname === link.path ? "text-trndsky-blue font-medium" : "text-gray-600 hover:text-trndsky-blue"}`}>
                <span className="block px-3 py-2 text-lg font-extrabold">
                  {link.label}
                </span>
                {location.pathname === link.path && <span className="absolute bottom-0 left-0 right-0 h-1 bg-trndsky-blue rounded-full transition-all duration-300"></span>}
              </Link>)}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors" aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-in slide-in-from-top">
            <div className="container mx-auto p-4">
              <div className="flex flex-col space-y-3 font-tajawal">
                {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={`p-3 rounded-lg transition-all duration-300 ${location.pathname === link.path ? "bg-gray-100 text-trndsky-blue font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-trndsky-blue"}`}>
                    {link.label}
                  </Link>)}
              </div>
            </div>
          </div>}
      </div>
    </nav>;
};
const navLinks = [{
  path: "/",
  label: "الرئيسية"
}, {
  path: "/software",
  label: "البرمجيات الجاهزة"
}, {
  path: "/partners",
  label: "شركاء النجاح"
}, {
  path: "/about",
  label: "من نحن"
}, {
  path: "/contact",
  label: "تواصل معنا"
}];
export default Navbar;
