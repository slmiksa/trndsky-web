
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { SimpleImageUpload } from '@/components/admin/SimpleImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
};

export default function SlideManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideDialogOpen, setSlideDialogOpen] = useState(false);
  const [slideToEdit, setSlideToEdit] = useState<Slide | null>(null);
  const [slideForm, setSlideForm] = useState<Omit<Slide, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
  });
  const [isSavingSlide, setIsSavingSlide] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error: any) {
      console.error('Error fetching slides:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب السلايدات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openNewSlideDialog = () => {
    setSlideToEdit(null);
    setSlideForm({
      title: '',
      subtitle: '',
      description: '',
      image: '',
    });
    setSlideDialogOpen(true);
  };

  const openEditSlideDialog = (slide: Slide) => {
    setSlideToEdit(slide);
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description,
      image: slide.image,
    });
    setSlideDialogOpen(true);
  };

  const handleSlideFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSlideForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSlide = async () => {
    try {
      setIsSavingSlide(true);
      
      if (slideToEdit) {
        const { error } = await supabase
          .from('slides')
          .update({
            title: slideForm.title,
            subtitle: slideForm.subtitle,
            description: slideForm.description,
            image: slideForm.image,
          })
          .eq('id', slideToEdit.id);

        if (error) throw error;
        
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث السلايد بنجاح',
        });
      } else {
        const maxIdResponse = await supabase
          .from('slides')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();
        
        const nextId = maxIdResponse.data ? maxIdResponse.data.id + 1 : 1;
        
        const { error } = await supabase.from('slides').insert({
          id: nextId,
          title: slideForm.title,
          subtitle: slideForm.subtitle,
          description: slideForm.description,
          image: slideForm.image,
        });

        if (error) throw error;
        
        toast({
          title: 'تمت الإضافة',
          description: 'تم إضافة السلايد بنجاح',
        });
      }
      
      fetchSlides();
      setSlideDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving slide:', error);
      toast({
        title: 'خطأ',
        description: `حدث خطأ أثناء حفظ السلايد: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsSavingSlide(false);
    }
  };

  const handleDeleteSlide = async (slideId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا السلايد؟')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', slideId);
      
      if (error) throw error;
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف السلايد بنجاح',
      });
      
      fetchSlides();
    } catch (error: any) {
      console.error('Error deleting slide:', error);
      toast({
        title: 'خطأ',
        description: `حدث خطأ أثناء حذف السلايد: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-trndsky-darkblue">
          إدارة السلايدات الرئيسية
        </h2>
        <Button onClick={openNewSlideDialog} className="flex items-center gap-2">
          <Plus size={18} /> إضافة سلايد
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-trndsky-blue">
          جارٍ التحميل...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="h-40 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=صورة+غير+متوفرة";
                }}
              />
              <CardContent className="p-4">
                <h3 className="font-bold text-trndsky-teal text-lg mb-1">{slide.title}</h3>
                {slide.subtitle && (
                  <div className="text-trndsky-darkblue font-medium">{slide.subtitle}</div>
                )}
                <div className="text-gray-700 text-sm mt-1 line-clamp-2">
                  {slide.description}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => openEditSlideDialog(slide)} 
                    title="تعديل"
                  >
                    <Edit size={18} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteSlide(slide.id)} 
                    title="حذف"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {slides.length === 0 && (
            <div className="text-gray-400 col-span-3 text-center py-12">
              لا توجد سلايدات حاليًا.
            </div>
          )}
        </div>
      )}
      
      <Dialog open={slideDialogOpen} onOpenChange={setSlideDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>{slideToEdit ? 'تعديل السلايد' : 'إضافة سلايد جديد'}</DialogTitle>
          </DialogHeader>
          
          <form className="space-y-4">
            <div>
              <label className="font-medium block mb-1">عنوان السلايد</label>
              <Input
                name="title"
                value={slideForm.title}
                onChange={handleSlideFormChange}
                required
                placeholder="عنوان السلايد"
              />
            </div>
            
            <div>
              <label className="font-medium block mb-1">العنوان الفرعي (اختياري)</label>
              <Input
                name="subtitle"
                value={slideForm.subtitle}
                onChange={handleSlideFormChange}
                placeholder="العنوان الفرعي"
              />
            </div>
            
            <div>
              <label className="font-medium block mb-1">الوصف</label>
              <Textarea
                name="description"
                value={slideForm.description}
                onChange={handleSlideFormChange}
                required
                placeholder="وصف السلايد"
                rows={3}
              />
            </div>
            
            <div>
              <label className="font-medium block mb-1">صورة السلايد</label>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">رفع صورة</TabsTrigger>
                  <TabsTrigger value="link">إدخال رابط</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-2 mt-2">
                  <ImageUpload
                    onUpload={(url: string) => setSlideForm(prev => ({ ...prev, image: url }))}
                    label="رفع صورة السلايد"
                  />
                </TabsContent>
                <TabsContent value="link" className="mt-2">
                  <SimpleImageUpload
                    onUpload={(url: string) => setSlideForm(prev => ({ ...prev, image: url }))}
                    label="إدخال رابط الصورة"
                    currentUrl={slideForm.image}
                  />
                </TabsContent>
              </Tabs>
              
              {slideForm.image && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">معاينة الصورة الحالية:</p>
                  <div className="max-w-full h-24">
                    <img
                      src={slideForm.image}
                      alt="معاينة"
                      className="h-full max-w-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=صورة+غير+متوفرة";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
          
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setSlideDialogOpen(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleSaveSlide}
              disabled={isSavingSlide}
            >
              {isSavingSlide ? 'جاري الحفظ...' : slideToEdit ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
