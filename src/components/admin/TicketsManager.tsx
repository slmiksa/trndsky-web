
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
import { Textarea } from "@/components/ui/textarea";
import { formatDistance } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  created_at: string;
  user_id: string;
  updated_at: string;
  user_email?: string;
}

interface TicketResponse {
  id: string;
  message: string;
  created_at: string;
  is_admin: boolean;
  user_id: string | null;
  ticket_id: string;
}

const TicketsManager = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<TicketResponse[]>([]);
  const [newResponse, setNewResponse] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          users_profiles(*)
        `)
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ticketsWithUserInfo = data.map((ticket: any) => ({
        ...ticket,
        user_email: ticket.users_profiles?.full_name || 'مستخدم غير معروف',
      }));

      setTickets(ticketsWithUserInfo);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('حدث خطأ أثناء تحميل التذاكر');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketResponses = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching ticket responses:', error);
      toast.error('حدث خطأ أثناء تحميل الردود');
    }
  };

  const handleSelectTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    await fetchTicketResponses(ticket.id);
  };

  const handleSubmitResponse = async () => {
    if (!selectedTicket || !newResponse.trim()) return;

    setResponseLoading(true);
    try {
      // Add admin response
      const { error: responseError } = await supabase
        .from('ticket_responses')
        .insert({
          ticket_id: selectedTicket.id,
          message: newResponse,
          is_admin: true,
        });

      if (responseError) throw responseError;

      // Update ticket status if closing
      if (selectedTicket.status === 'open') {
        const { error: updateError } = await supabase
          .from('support_tickets')
          .update({ status: 'closed', updated_at: new Date().toISOString() })
          .eq('id', selectedTicket.id);

        if (updateError) throw updateError;
      }

      toast.success('تم إرسال الرد بنجاح');
      setNewResponse('');
      fetchTicketResponses(selectedTicket.id);
      fetchTickets(); // Refresh tickets list
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('حدث خطأ أثناء إرسال الرد');
    } finally {
      setResponseLoading(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'open', updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      toast.success('تم إعادة فتح التذكرة بنجاح');
      setSelectedTicket({ ...selectedTicket, status: 'open' });
      fetchTickets();
    } catch (error) {
      console.error('Error reopening ticket:', error);
      toast.error('حدث خطأ أثناء إعادة فتح التذكرة');
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'closed', updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      toast.success('تم إغلاق التذكرة بنجاح');
      setSelectedTicket({ ...selectedTicket, status: 'closed' });
      fetchTickets();
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast.error('حدث خطأ أثناء إغلاق التذكرة');
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-tajawal">إدارة تذاكر الدعم الفني</CardTitle>
          <CardDescription className="font-tajawal">إدارة ومتابعة تذاكر الدعم الفني الواردة من العملاء</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <Tabs defaultValue="open" value={activeTab} onValueChange={(v) => setActiveTab(v as 'open' | 'closed')}>
                <TabsList className="w-full mb-2">
                  <TabsTrigger value="open" className="w-full font-tajawal">التذاكر المفتوحة</TabsTrigger>
                  <TabsTrigger value="closed" className="w-full font-tajawal">التذاكر المغلقة</TabsTrigger>
                </TabsList>
                
                <TabsContent value="open" className="mt-0">
                  <Card>
                    <CardContent className="p-2">
                      {loading ? (
                        <div className="text-center py-4 font-tajawal">جاري التحميل...</div>
                      ) : tickets.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground font-tajawal">لا توجد تذاكر مفتوحة حالياً</div>
                      ) : (
                        <div className="max-h-[500px] overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[200px] font-tajawal">الموضوع</TableHead>
                                <TableHead className="font-tajawal">المستخدم</TableHead>
                                <TableHead className="font-tajawal">التاريخ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tickets.map((ticket) => (
                                <TableRow 
                                  key={ticket.id} 
                                  className={`cursor-pointer hover:bg-muted ${selectedTicket?.id === ticket.id ? 'bg-muted' : ''}`}
                                  onClick={() => handleSelectTicket(ticket)}
                                >
                                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                                  <TableCell>{ticket.user_email}</TableCell>
                                  <TableCell dir="ltr">{formatDate(ticket.created_at)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="closed" className="mt-0">
                  <Card>
                    <CardContent className="p-2">
                      {loading ? (
                        <div className="text-center py-4 font-tajawal">جاري التحميل...</div>
                      ) : tickets.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground font-tajawal">لا توجد تذاكر مغلقة</div>
                      ) : (
                        <div className="max-h-[500px] overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[200px] font-tajawal">الموضوع</TableHead>
                                <TableHead className="font-tajawal">المستخدم</TableHead>
                                <TableHead className="font-tajawal">التاريخ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tickets.map((ticket) => (
                                <TableRow 
                                  key={ticket.id} 
                                  className={`cursor-pointer hover:bg-muted ${selectedTicket?.id === ticket.id ? 'bg-muted' : ''}`}
                                  onClick={() => handleSelectTicket(ticket)}
                                >
                                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                                  <TableCell>{ticket.user_email}</TableCell>
                                  <TableCell dir="ltr">{formatDate(ticket.created_at)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="w-full md:w-2/3">
              {selectedTicket ? (
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-tajawal">{selectedTicket.subject}</CardTitle>
                        <CardDescription className="font-tajawal mt-1">
                          {selectedTicket.user_email} - {formatDate(selectedTicket.created_at)}
                        </CardDescription>
                      </div>
                      <Badge variant={selectedTicket.status === 'open' ? 'default' : 'secondary'}>
                        {selectedTicket.status === 'open' ? 'مفتوحة' : 'مغلقة'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-4 mb-4 bg-muted/50">
                      <p className="whitespace-pre-wrap font-tajawal">{selectedTicket.message}</p>
                    </div>
                    
                    <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
                      {responses.map((response) => (
                        <div 
                          key={response.id} 
                          className={`p-3 rounded-md ${
                            response.is_admin 
                              ? 'bg-primary/10 mr-8' 
                              : 'bg-muted ml-8'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium font-tajawal">
                              {response.is_admin ? 'فريق الدعم الفني' : selectedTicket.user_email}
                            </span>
                            <span className="text-xs text-muted-foreground" dir="ltr">
                              {formatDate(response.created_at)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap font-tajawal">{response.message}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="اكتب ردك هنا..."
                        className="min-h-[100px] font-tajawal"
                        dir="rtl"
                      />
                      
                      <div className="flex justify-between">
                        <div>
                          {selectedTicket.status === 'open' ? (
                            <Button variant="outline" onClick={handleCloseTicket}>
                              إغلاق التذكرة
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={handleReopenTicket}>
                              إعادة فتح التذكرة
                            </Button>
                          )}
                        </div>
                        <Button 
                          onClick={handleSubmitResponse}
                          disabled={responseLoading || !newResponse.trim()}
                        >
                          {responseLoading ? 'جاري الإرسال...' : 'إرسال الرد'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center border rounded-lg p-8">
                  <p className="text-muted-foreground text-center font-tajawal">
                    الرجاء اختيار تذكرة من القائمة لعرض محتواها
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketsManager;
