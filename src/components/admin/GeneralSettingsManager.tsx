import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Settings, Globe } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SimpleImageUpload } from './SimpleImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GeneralSettings {
  site_title: string;
  favicon_url: string | null;
}

export const GeneralSettingsManager = () => {
  const [settings, setSettings] = useState<GeneralSettings>({
    site_title: '',
    favicon_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      console.log('جاري تحميل الإعدادات العامة...');
      
      // استخدام maybeSingle للتعامل مع الحالات التي لا توجد فيها بيانات بعد
      const { data, error } = await supabase
        .from('general_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching general settings:', error);
        toast.error('فشل في تحميل إعدادات الموقع');
      } else if (data) {
        console.log('تم تحميل الإعدادات:', data);
        setSettings({
          site_title: data.site_title || '',
          favicon_url: data.favicon_url || ''
        });
      } else {
        console.log('لم يتم العثور على إعدادات عامة، سيتم استخدام القيم الافتراضية');
        // لا نقوم بتعيين قيم افتراضية هنا للسماح للمستخدم بإدخالها
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      console.log('جاري حفظ الإعدادات:', settings);
      
      const { data, error } = await supabase
        .from('general_settings')
        .upsert({ 
          id: 1, // استخدام معرف ثابت للإعدادات العامة
          site_title: settings.site_title,
          favicon_url: settings.favicon_url,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('فشل في حفظ الإعدادات');
        return;
      }
      
      console.log('تم حفظ الإعدادات بنجاح:', data);
      toast.success('تم حفظ الإعدادات بنجاح');
      
      // تطبيق التغييرات فوراً
      applySettings(settings);
      
      // إعادة تحميل الصفحة بعد ثانية واحدة لتطبيق التغييرات بشكل كامل
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  // دالة جديدة لتطبيق الإعدادات مباشرة
  const applySettings = ({ site_title, favicon_url }: GeneralSettings) => {
    // تحديث عنوان الصفحة
    if (site_title) {
      document.title = site_title;
    }
      
    // تحديث الأيقونة
    if (favicon_url) {
      updateFavicon(favicon_url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFaviconUpload = (url: string) => {
    console.log('تم تحديث رابط الأيقونة:', url);
    setSettings(prev => ({
      ...prev,
      favicon_url: url
    }));
  };

  // تحديث الأيقونة في المتصفح
  const updateFavicon = (url: string) => {
    if (!url) return;
    
    console.log('تحديث الأيقونة إلى:', url);
    
    const timestamp = new Date().getTime(); // إضافة طابع زمني لمنع التخزين المؤقت
    const faviconUrl = `${url}?t=${timestamp}`;
    
    // إزالة جميع الأيقونات الموجودة أولاً
    document.querySelectorAll("link[rel*='icon']").forEach(icon => {
      document.head.removeChild(icon);
    });
    
    // تحديث favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
    
    // تحديث apple-touch-icon
    const touchIcon = document.createElement('link');
    touchIcon.rel = 'apple-touch-icon';
    touchIcon.href = faviconUrl;
    document.head.appendChild(touchIcon);
    
    // إضافة رابط آخر للتأكد من تحديث الأيقونة في متصفحات مختلفة
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = faviconUrl;
    document.head.appendChild(shortcutIcon);
    
    console.log('تم تحديث الأيقونة بنجاح');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-trndsky-blue" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-tajawal">
          <Settings className="h-6 w-6" />
          الإعدادات العامة للموقع
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site_title" className="font-tajawal">عنوان الموقع (يظهر في المتصفح)</Label>
            <Input
              id="site_title"
              name="site_title"
              value={settings.site_title}
              onChange={handleInputChange}
              className="font-tajawal"
              placeholder="أدخل عنوان الموقع"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-tajawal">أيقونة الموقع (Favicon)</Label>
            <Tabs defaultValue="upload">
              <TabsList className="mb-4">
                <TabsTrigger value="upload" className="font-tajawal">رفع صورة</TabsTrigger>
                <TabsTrigger value="url" className="font-tajawal">استخدام رابط</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload">
                <ImageUpload 
                  onUpload={handleFaviconUpload} 
                  label="رفع أيقونة الموقع" 
                  bucketName="public"
                />
              </TabsContent>
              
              <TabsContent value="url">
                <SimpleImageUpload 
                  onUpload={handleFaviconUpload} 
                  label="استخدام رابط للأيقونة" 
                  currentUrl={settings.favicon_url || ''}
                />
              </TabsContent>
            </Tabs>

            {settings.favicon_url && (
              <div className="mt-4 border p-4 rounded-md bg-gray-50">
                <p className="text-sm text-muted-foreground mb-2 font-tajawal">معاينة الأيقونة المختارة:</p>
                <div className="flex items-center gap-2">
                  <img 
                    src={`${settings.favicon_url}?t=${Date.now()}`} 
                    alt="أيقونة الموقع" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/32x32?text=خطأ";
                    }}
                  />
                  <span className="text-sm text-gray-600">{settings.favicon_url}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button 
              onClick={saveSettings} 
              disabled={saving} 
              className="w-full font-tajawal"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  حفظ الإعدادات
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsManager;
