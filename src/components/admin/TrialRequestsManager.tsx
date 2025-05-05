
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageSquare, Trash } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TrialRequest {
  id: string;
  created_at: string;
  company_name: string;
  whatsapp: string;
  status: 'new' | 'contacted' | 'completed' | 'rejected';
}

const TrialRequestsManager = () => {
  const [trialRequests, setTrialRequests] = useState<TrialRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'contacted' | 'completed' | 'rejected'>('new');

  useEffect(() => {
    fetchTrialRequests();
  }, [activeTab]);

  const fetchTrialRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trial_requests')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrialRequests(data || []);
    } catch (error) {
      console.error('Error fetching trial requests:', error);
      toast.error('حدث خطأ أثناء تحميل طلبات التجربة');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: 'new' | 'contacted' | 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('trial_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchTrialRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
      const { error } = await supabase
        .from('trial_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('تم حذف الطلب بنجاح');
      fetchTrialRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('حدث خطأ أثناء حذف الطلب');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), {
        addSuffix: true,
        locale: ar,
      });
    } catch (error) {
      return 'تاريخ غير صالح';
    }
  };

  const openWhatsApp = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-yellow-500">جديد</Badge>;
      case 'contacted':
        return <Badge className="bg-blue-500">تم التواصل</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">مكتمل</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-tajawal">إدارة طلبات التجربة</CardTitle>
          <CardDescription className="font-tajawal">إدارة طلبات تجربة البرمجيات والحلول</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="new" className="font-tajawal">جديد</TabsTrigger>
              <TabsTrigger value="contacted" className="font-tajawal">تم التواصل</TabsTrigger>
              <TabsTrigger value="completed" className="font-tajawal">مكتمل</TabsTrigger>
              <TabsTrigger value="rejected" className="font-tajawal">مرفوض</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="text-center py-8 font-tajawal">جاري التحميل...</div>
              ) : trialRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-tajawal">
                  لا توجد طلبات {activeTab === 'new' ? 'جديدة' : activeTab === 'contacted' ? 'تم التواصل معها' : activeTab === 'completed' ? 'مكتملة' : 'مرفوضة'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-tajawal">اسم الشركة</TableHead>
                        <TableHead className="font-tajawal">رقم الواتساب</TableHead>
                        <TableHead className="font-tajawal">تاريخ الطلب</TableHead>
                        <TableHead className="font-tajawal">الحالة</TableHead>
                        <TableHead className="font-tajawal">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trialRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium font-tajawal">{request.company_name}</TableCell>
                          <TableCell dir="ltr">{request.whatsapp}</TableCell>
                          <TableCell dir="ltr">{formatDate(request.created_at)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openWhatsApp(request.whatsapp)}
                                title="محادثة واتساب"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => updateRequestStatus(request.id, 
                                  activeTab === 'new' ? 'contacted' : 
                                  activeTab === 'contacted' ? 'completed' : 'new'
                                )}
                                title={
                                  activeTab === 'new' ? 'تحديث إلى تم التواصل' : 
                                  activeTab === 'contacted' ? 'تحديث إلى مكتمل' :
                                  'تحديث إلى جديد'
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteRequest(request.id)}
                                title="حذف الطلب"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialRequestsManager;
