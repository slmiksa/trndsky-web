
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
import { Eye, Trash, MessageSquare, FileText } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProjectRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected';
}

const ProjectRequestsManager = () => {
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected'>('new');
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchProjectRequests();
  }, [activeTab]);

  const fetchProjectRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure it matches the ProjectRequest type
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected'
      }));
      
      setProjectRequests(typedData);
    } catch (error) {
      console.error('Error fetching project requests:', error);
      toast.error('حدث خطأ أثناء تحميل طلبات المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('project_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchProjectRequests();
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
      const { error } = await supabase
        .from('project_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('تم حذف الطلب بنجاح');
      fetchProjectRequests();
      if (isDetailModalOpen && selectedRequest && selectedRequest.id === id) {
        setIsDetailModalOpen(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('حدث خطأ أثناء حذف الطلب');
    }
  };

  const openDetails = (request: ProjectRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-yellow-500">جديد</Badge>;
      case 'contacted':
        return <Badge className="bg-blue-500">تم التواصل</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-500">قيد التنفيذ</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">مكتمل</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'new':
        return 'contacted';
      case 'contacted':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      default:
        return 'new';
    }
  };

  const getNextStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'new':
        return 'تم التواصل';
      case 'contacted':
        return 'قيد التنفيذ';
      case 'in_progress':
        return 'مكتمل';
      default:
        return 'جديد';
    }
  };

  const openEmailOrWhatsApp = (type: 'email' | 'whatsapp', contact: string) => {
    if (type === 'email') {
      window.open(`mailto:${contact}`, '_blank');
    } else {
      const whatsappUrl = `https://wa.me/${contact.replace(/\+/g, '')}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-tajawal">إدارة طلبات البرمجة الخاصة</CardTitle>
          <CardDescription className="font-tajawal">إدارة طلبات تطوير البرمجيات والمشاريع الخاصة من العملاء</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="new" className="font-tajawal">جديد</TabsTrigger>
              <TabsTrigger value="contacted" className="font-tajawal">تم التواصل</TabsTrigger>
              <TabsTrigger value="in_progress" className="font-tajawal">قيد التنفيذ</TabsTrigger>
              <TabsTrigger value="completed" className="font-tajawal">مكتمل</TabsTrigger>
              <TabsTrigger value="rejected" className="font-tajawal">مرفوض</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="text-center py-8 font-tajawal">جاري التحميل...</div>
              ) : projectRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-tajawal">
                  لا توجد طلبات {
                    activeTab === 'new' ? 'جديدة' : 
                    activeTab === 'contacted' ? 'تم التواصل معها' : 
                    activeTab === 'in_progress' ? 'قيد التنفيذ' : 
                    activeTab === 'completed' ? 'مكتملة' : 'مرفوضة'
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-tajawal">العنوان</TableHead>
                        <TableHead className="font-tajawal">الاسم</TableHead>
                        <TableHead className="font-tajawal">البريد الإلكتروني</TableHead>
                        <TableHead className="font-tajawal">رقم الهاتف</TableHead>
                        <TableHead className="font-tajawal">تاريخ الطلب</TableHead>
                        <TableHead className="font-tajawal">الحالة</TableHead>
                        <TableHead className="font-tajawal">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium font-tajawal">{request.title}</TableCell>
                          <TableCell className="font-tajawal">{request.name}</TableCell>
                          <TableCell dir="ltr">{request.email}</TableCell>
                          <TableCell dir="ltr">{request.phone}</TableCell>
                          <TableCell dir="ltr">{formatDate(request.created_at)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openDetails(request)}
                                title="عرض التفاصيل"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => updateRequestStatus(
                                  request.id, 
                                  getNextStatus(request.status) as any
                                )}
                                title={`تحديث إلى ${getNextStatusText(request.status)}`}
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

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent dir="rtl" className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-tajawal text-xl">{selectedRequest?.title}</DialogTitle>
            <DialogDescription className="font-tajawal">
              تفاصيل الطلب | {formatDate(selectedRequest?.created_at || '')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">الاسم</h4>
                  <p className="text-sm font-tajawal">{selectedRequest.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">الحالة</h4>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">البريد الإلكتروني</h4>
                  <p className="text-sm" dir="ltr">{selectedRequest.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">رقم الهاتف</h4>
                  <p className="text-sm" dir="ltr">{selectedRequest.phone}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1 font-tajawal">تفاصيل المشروع</h4>
                <div className="border rounded-md p-3 text-sm bg-muted/50 font-tajawal whitespace-pre-wrap">
                  {selectedRequest.description}
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-2 pt-4">
                <div className="space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEmailOrWhatsApp('email', selectedRequest.email)}
                    className="font-tajawal"
                  >
                    <MessageSquare className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    إرسال بريد
                  </Button>
                  
                  {selectedRequest.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEmailOrWhatsApp('whatsapp', selectedRequest.phone)}
                      className="font-tajawal"
                    >
                      <MessageSquare className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      واتساب
                    </Button>
                  )}
                </div>

                <div className="space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      updateRequestStatus(
                        selectedRequest.id, 
                        getNextStatus(selectedRequest.status) as any
                      );
                    }}
                    className="font-tajawal"
                  >
                    {`تحديث إلى ${getNextStatusText(selectedRequest.status)}`}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="font-tajawal"
                  >
                    حذف الطلب
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectRequestsManager;
