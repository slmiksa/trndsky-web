
import { useState } from "react";
import { X, Maximize, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div 
              key={index} 
              className="relative group h-24 border border-gray-200 rounded overflow-hidden bg-gray-50"
            >
              <img 
                src={image} 
                alt={`صورة ${index + 1}`}
                className="h-full w-full object-contain cursor-pointer"
                onClick={() => openFullScreen(image, index)}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-white text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => openFullScreen(image, index)}
                >
                  <Maximize size={16} />
                </Button>
                
                {!readOnly && onRemoveImage && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-white text-red-500 hover:bg-red-50 hover:text-red-600 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(index);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            لا توجد صور متاحة
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
            className="max-w-4xl w-[90vw] p-1"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <div className="relative w-full h-[80vh] outline-none" tabIndex={-1}>
              <div className="h-full flex items-center justify-center">
                <img
                  src={images[selectedIndex]}
                  alt={`صورة ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                
                {/* زر الصورة السابقة */}
                {selectedIndex > 0 && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
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
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40"
                onClick={closeFullScreen}
              >
                <X size={16} />
              </Button>
              
              {/* عداد الصور */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/40 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
