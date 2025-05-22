
import { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('الرجاء كتابة استفسارك');
      return;
    }
    
    const encodedMessage = encodeURIComponent(`${defaultMessage}\n\n${message}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // فتح واتساب في نافذة جديدة
    window.open(whatsappUrl, '_blank');

    // إعادة ضبط وإغلاق النموذج
    setMessage('');
    setIsOpen(false);
    toast.success('تم توجيهك إلى واتساب');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card bg-white shadow-lg rounded-lg p-4 mb-4 w-80 border border-trndsky-blue/20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold font-tajawal text-trndsky-darkblue">مبيعات TRNDSKY</h3>
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
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 text-right font-tajawal focus:ring-2 focus:ring-trndsky-blue focus:border-transparent"
                rows={3}
              />
              
              <button
                type="submit"
                className="w-full bg-trndsky-blue hover:bg-trndsky-darkblue text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-blue-glow font-tajawal text-base hover:shadow-lg"
              >
                <span>إرسال إلى واتساب</span>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="التواصل معنا"
            className="bg-trndsky-blue text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 border-2 border-white py-3 px-5 hover:bg-trndsky-darkblue"
          >
            <div className="relative">
              <MessageCircle size={24} className="text-white" />
              <span className="absolute -top-2 -right-2 bg-white text-trndsky-blue text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse-soft">?</span>
            </div>
            <span className="mr-2 font-tajawal text-white text-base">عندك استفسار؟</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingContactButton;
