
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { WhatsAppSettings } from '@/hooks/useWhatsAppNumber';

const WhatsAppSettingsManager = () => {
  const [settings, setSettings] = useState<WhatsAppSettings>({
    phone_number: '',
    default_message: '',
    enabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('whatsapp_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching WhatsApp settings:', error);
          toast.error('حدث خطأ أثناء تحميل إعدادات واتساب');
        } else if (data) {
          setSettings({
            phone_number: data.phone_number,
            default_message: data.default_message,
            enabled: data.enabled
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('حدث خطأ أثناء تحميل إعدادات واتساب');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Format phone number - remove any non-digit characters and ensure it doesn't start with '+'
      let formattedNumber = settings.phone_number.replace(/\D/g, '');
      
      // Check if we need to add country code
      if (!formattedNumber.startsWith('966')) {
        toast.error('يجب أن يبدأ رقم الهاتف بمفتاح الدولة (966)');
        return;
      }

      const { error } = await supabase
        .from('whatsapp_settings')
        .update({
          phone_number: formattedNumber,
          default_message: settings.default_message,
          enabled: settings.enabled
        })
        .eq('id', 1);

      if (error) {
        throw error;
      }

      toast.success('تم حفظ إعدادات واتساب بنجاح');
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      toast.error('حدث خطأ أثناء حفظ إعدادات واتساب');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-10 w-10 text-trndsky-blue animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-tajawal text-right">إعدادات أيقونة واتساب</CardTitle>
        <CardDescription className="font-tajawal text-right">
          تخصيص إعدادات أيقونة الاستفسار وواتساب
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone_number" className="block text-right font-tajawal">
            رقم الواتساب (مع مفتاح الدولة)
          </Label>
          <Input
            id="phone_number"
            value={settings.phone_number}
            onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
            placeholder="966575594911"
            className="text-right"
          />
          <p className="text-xs text-gray-500 text-right font-tajawal">
            مثال: 966575594911 (بدون + أو مسافات)
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="default_message" className="block text-right font-tajawal">
            رسالة افتراضية
          </Label>
          <Textarea
            id="default_message"
            value={settings.default_message}
            onChange={(e) => setSettings({ ...settings, default_message: e.target.value })}
            placeholder="استفسار من موقع TRNDSKY"
            className="text-right font-tajawal"
            rows={3}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Switch
            id="enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
          />
          <Label htmlFor="enabled" className="font-tajawal">
            تفعيل أيقونة الاستفسار
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="font-tajawal"
        >
          {saving ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : 'حفظ التغييرات'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WhatsAppSettingsManager;
