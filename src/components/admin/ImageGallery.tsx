
import { useState } from "react";
import { X, Maximize, Trash2 } from "lucide-react";
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

  // التنقل بين الصور
  const navigateImages = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedIndex(newIndex);
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
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeFullScreen()}>
        <DialogContent className="max-w-4xl w-[90vw] p-1">
          <div className="relative w-full h-[80vh]">
            {selectedImage && (
              <Carousel className="w-full h-full">
                <CarouselContent className="h-full">
                  {images.map((img, i) => (
                    <CarouselItem key={i} className={cn("h-full flex items-center justify-center", i === selectedIndex ? "block" : "hidden")}>
                      <img
                        src={img}
                        alt={`صورة ${i + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious 
                  className="left-1 lg:left-4 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImages(selectedIndex - 1);
                  }}
                />
                <CarouselNext 
                  className="right-1 lg:right-4 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImages(selectedIndex + 1);
                  }}
                />
              </Carousel>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={closeFullScreen}
            >
              <X size={16} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
