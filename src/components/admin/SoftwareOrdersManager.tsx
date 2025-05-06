
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

interface SoftwareOrder {
  id: string;
  created_at: string;
  company_name: string;
  whatsapp: string;
  status: 'new' | 'contacted' | 'completed' | 'rejected';
  software_id: number;
  software_title?: string;
  software_image_url?: string;
}

interface SoftwareProduct {
  title: string;
  image_url: string;
}

const SoftwareOrdersManager = () => {
  const [orders, setOrders] = useState<SoftwareOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'new' | 'contacted' | 'completed' | 'rejected'>('new');
  const [selectedOrder, setSelectedOrder] = useState<SoftwareOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchSoftwareOrders();
  }, [activeTab]);

  const fetchSoftwareOrders = async () => {
    setLoading(true);
    try {
      // First, fetch the orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('software_orders')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      
      // Create a transformed array with correct typing
      const transformedOrders: SoftwareOrder[] = [];
      
      // For each order, fetch the related software product details
      for (const order of ordersData || []) {
        // Fetch the related software product
        const { data: productData, error: productError } = await supabase
          .from('software_products')
          .select('title, image_url')
          .eq('id', order.software_id)
          .single();
          
        // Type assertion to ensure the status is one of the allowed values
        const typedStatus = order.status as 'new' | 'contacted' | 'completed' | 'rejected';
        
        // Add to our transformed array with correct typing
        transformedOrders.push({
          ...order,
          status: typedStatus,
          software_title: productError ? 'برنامج غير معروف' : productData?.title,
          software_image_url: productError ? null : productData?.image_url
        });
      }
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching software orders:', error);
      toast.error('حدث خطأ أثناء تحميل طلبات البرمجيات');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: 'new' | 'contacted' | 'completed' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('software_orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('تم تحديث حالة الطلب بنجاح');
      fetchSoftwareOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
      const { error } = await supabase
        .from('software_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('تم حذف الطلب بنجاح');
      fetchSoftwareOrders();
      if (isDetailModalOpen && selectedOrder && selectedOrder.id === id) {
        setIsDetailModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('حدث خطأ أثناء حذف الطلب');
    }
  };

  const openDetails = (order: SoftwareOrder) => {
    setSelectedOrder(order);
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
        return 'مكتمل';
      default:
        return 'جديد';
    }
  };

  const openWhatsApp = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-tajawal">إدارة طلبات شراء البرمجيات</CardTitle>
          <CardDescription className="font-tajawal">إدارة طلبات شراء البرمجيات الجاهزة من العملاء</CardDescription>
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
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-tajawal">
                  لا توجد طلبات {
                    activeTab === 'new' ? 'جديدة' : 
                    activeTab === 'contacted' ? 'تم التواصل معها' : 
                    activeTab === 'completed' ? 'مكتملة' : 'مرفوضة'
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-tajawal">البرنامج</TableHead>
                        <TableHead className="font-tajawal">اسم الشركة</TableHead>
                        <TableHead className="font-tajawal">رقم الواتساب</TableHead>
                        <TableHead className="font-tajawal">تاريخ الطلب</TableHead>
                        <TableHead className="font-tajawal">الحالة</TableHead>
                        <TableHead className="font-tajawal">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium font-tajawal">{order.software_title || 'برنامج غير معروف'}</TableCell>
                          <TableCell className="font-tajawal">{order.company_name}</TableCell>
                          <TableCell dir="ltr">{order.whatsapp}</TableCell>
                          <TableCell dir="ltr">{formatDate(order.created_at)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => openDetails(order)}
                                title="عرض التفاصيل"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => updateOrderStatus(
                                  order.id, 
                                  getNextStatus(order.status) as any
                                )}
                                title={`تحديث إلى ${getNextStatusText(order.status)}`}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteOrder(order.id)}
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
            <DialogTitle className="font-tajawal text-xl">تفاصيل طلب البرنامج</DialogTitle>
            <DialogDescription className="font-tajawal">
              {selectedOrder?.software_title || 'برنامج غير معروف'} | {formatDate(selectedOrder?.created_at || '')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {selectedOrder.software_image_url && (
                <div className="rounded-md overflow-hidden h-40 flex justify-center items-center">
                  <img 
                    src={selectedOrder.software_image_url} 
                    alt={selectedOrder.software_title || 'صورة البرنامج'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">الشركة / العميل</h4>
                  <p className="text-sm font-tajawal">{selectedOrder.company_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">الحالة</h4>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 font-tajawal">رقم الواتساب</h4>
                  <p className="text-sm" dir="ltr">{selectedOrder.whatsapp}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openWhatsApp(selectedOrder.whatsapp)}
                  className="font-tajawal"
                >
                  <MessageSquare className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  تواصل عبر واتساب
                </Button>

                <div className="space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      updateOrderStatus(
                        selectedOrder.id, 
                        getNextStatus(selectedOrder.status) as any
                      );
                    }}
                    className="font-tajawal"
                  >
                    {`تحديث إلى ${getNextStatusText(selectedOrder.status)}`}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteOrder(selectedOrder.id)}
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

export default SoftwareOrdersManager;
