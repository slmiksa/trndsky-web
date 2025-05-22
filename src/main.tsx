
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// منع تحميل الأيقونة الافتراضية للوفابيل
document.addEventListener('DOMContentLoaded', () => {
  // إزالة أي أيقونة افتراضية قد تكون موجودة لكن غير مرغوبة
  document.querySelectorAll("link[rel*='icon']").forEach(icon => {
    if (icon.getAttribute('href')?.includes('favicon.ico') || 
        (icon.getAttribute('href') && !icon.getAttribute('href')?.includes('lovable-uploads'))) {
      icon.parentNode?.removeChild(icon);
    }
  });
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />);
