
import { useState, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FloatingContactButtonProps {
  phoneNumber: string;
  defaultMessage?: string;
}

const FloatingContactButton = ({
  phoneNumber,
  defaultMessage = "استفسار من موقع TRNDSKY"
}: FloatingContactButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show after scrolling down 200px
      if (currentScrollY > 200) {
        setIsVisible(true);
      }

      // Hide when scrolling back to top
      if (currentScrollY < 100) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    // Always show button on mobile
    if (window.innerWidth < 768) {
      setIsVisible(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('الرجاء كتابة استفسارك');
      return;
    }
    const encodedMessage = encodeURIComponent(`${defaultMessage}\n\n${message}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Reset and close form
    setMessage('');
    setIsOpen(false);
    toast.success('تم توجيهك إلى واتساب');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            y: 20
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9
                }}
                className="glass-card bg-white shadow-lg rounded-lg p-4 mb-4 w-72"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold font-tajawal">مبيعات TRNDSKY</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="إغلاق"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="اكتب استفسارك هنا..."
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-right font-tajawal"
                    rows={3}
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-trndsky-teal to-trndsky-blue hover:from-trndsky-blue hover:to-trndsky-teal text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-blue-glow font-tajawal"
                  >
                    <span>إرسال إلى واتساب</span>
                    <Send size={18} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.05
                }}
                whileTap={{
                  scale: 0.95
                }}
                onClick={() => setIsOpen(true)}
                className="bg-trndsky-blue text-white rounded-full p-4 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white"
                aria-label="التواصل معنا"
              >
                <div className="relative">
                  <MessageCircle size={28} className="text-white" />
                  <span className="absolute -top-2 -right-2 bg-white text-trndsky-blue text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-soft">?</span>
                </div>
                <span className="mr-2 font-tajawal text-white">عندك إستفسار ؟</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContactButton;
