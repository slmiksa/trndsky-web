
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
    site_title: 'TRNDSKY - خدمات برمجية احترافية',
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
      const { data, error } = await supabase
        .from('general_settings' as any)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching general settings:', error);
        toast.error('فشل في تحميل إعدادات الموقع');
      } else if (data) {
        // Cast the data to our interface
        const settingsData = data as unknown as GeneralSettings;
        setSettings({
          site_title: settingsData.site_title || 'TRNDSKY - خدمات برمجية احترافية',
          favicon_url: settingsData.favicon_url || ''
        });
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
      const { data, error } = await supabase
        .from('general_settings' as any)
        .upsert({ 
          id: 1, // استخدام معرف ثابت للإعدادات العامة
          site_title: settings.site_title,
          favicon_url: settings.favicon_url,
          updated_at: new Date().toISOString() // Convert to ISO string to fix Date type error
        })
        .select();

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('فشل في حفظ الإعدادات');
      } else {
        toast.success('تم حفظ الإعدادات بنجاح');
        // تطبيق التغييرات على العنوان والأيقونة مباشرة
        document.title = settings.site_title;
        updateFavicon(settings.favicon_url || '');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setSaving(false);
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
    setSettings(prev => ({
      ...prev,
      favicon_url: url
    }));
  };

  // تحديث الأيقونة في المتصفح
  const updateFavicon = (url: string) => {
    if (!url) return;
    
    // البحث عن علامة الأيقونة الحالية
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    
    // إنشاء علامة جديدة إذا لم تكن موجودة
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    // تحديث المسار
    link.href = url;
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
                    src={settings.favicon_url} 
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
