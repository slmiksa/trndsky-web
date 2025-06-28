
import { useState } from "react";
import { X, Maximize, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ImageGalleryProps = {
  images: string[];
  onRemoveImage?: (index: number) => void;
  readOnly?: boolean;
};

export function ImageGallery({ images, onRemoveImage, readOnly = false }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // فتح الصورة في وضع كبير
  const openFullScreen = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  // إغلاق الصورة
  const closeFullScreen = () => {
    setSelectedImage(null);
  };

  // التنقل بين الصور - للصورة السابقة
  const navigatePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(images[selectedIndex - 1]);
    }
  };

  // التنقل بين الصور - للصورة التالية
  const navigateNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(images[selectedIndex + 1]);
    }
  };

  // التعامل مع أحداث لوحة المفاتيح للتنقل
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        setSelectedImage(images[selectedIndex - 1]);
      }
    } else if (e.key === 'ArrowRight') {
      if (selectedIndex < images.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        setSelectedImage(images[selectedIndex + 1]);
      }
    } else if (e.key === 'Escape') {
      closeFullScreen();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div 
              key={index} 
              className="relative group h-32 bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <img 
                src={image} 
                alt={`صورة ${index + 1}`}
                className="h-full w-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-110"
                onClick={() => openFullScreen(image, index)}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white hover:text-gray-900 shadow-lg"
                    onClick={() => openFullScreen(image, index)}
                  >
                    <Maximize size={18} />
                  </Button>
                  
                  {!readOnly && onRemoveImage && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage(index);
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* رقم الصورة */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm font-tajawal">
                {index + 1}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8">
              <p className="text-gray-500 font-tajawal text-lg">لا توجد صور متاحة</p>
              <p className="text-gray-400 font-tajawal text-sm mt-2">سيتم عرض الصور هنا عند إضافتها</p>
            </div>
          </div>
        )}
      </div>

      {/* نافذة عرض الصورة بحجم كبير */}
      {selectedImage && (
        <Dialog 
          open={!!selectedImage} 
          onOpenChange={(open) => !open && closeFullScreen()}
        >
          <DialogContent 
            className="max-w-6xl w-[95vw] p-2 bg-black/95 border-none"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="relative w-full h-[85vh] outline-none" tabIndex={-1}>
              <div className="h-full flex items-center justify-center">
                <img
                  src={images[selectedIndex]}
                  alt={`صورة ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                
                {/* زر الصورة السابقة */}
                {selectedIndex > 0 && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-2"
                    onClick={navigatePrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                    <span className="sr-only">الصورة السابقة</span>
                  </Button>
                )}
                
                {/* زر الصورة التالية */}
                {selectedIndex < images.length - 1 && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl border-2"
                    onClick={navigateNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                    <span className="sr-only">الصورة التالية</span>
                  </Button>
                )}
              </div>
              
              {/* زر إغلاق العرض */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-sm shadow-lg"
                onClick={closeFullScreen}
              >
                <X size={20} />
              </Button>
              
              {/* عداد الصور */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm backdrop-blur-sm shadow-lg font-tajawal font-bold">
                {selectedIndex + 1} من {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
