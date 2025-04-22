
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, Key, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};

type AdminFormData = {
  email: string;
  password: string;
};

export function AdminUsersManager() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState<AdminFormData>({ email: "", password: "" });
  const [resetPasswordData, setResetPasswordData] = useState<{ id: string; email: string; password: string }>({ id: "", email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const { supabaseAuth } = useAdminAuth();

  // تحميل المشرفين
  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setIsLoading(true);
      
      // الحصول على قائمة المشرفين
      const { data: adminUsersData, error: adminUsersError } = await supabase
        .from("admin_users")
        .select("user_id")
        .order("created_at", { ascending: false });

      if (adminUsersError) throw adminUsersError;

      if (adminUsersData && adminUsersData.length > 0) {
        // الحصول على بيانات المستخدمين من جدول auth.users
        const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers();
        
        if (authUsersError) throw authUsersError;
        
        // تنسيق البيانات
        const userIdMap = new Set(adminUsersData.map(admin => admin.user_id));
        const filteredUsers = authUsers.users
          .filter(user => userIdMap.has(user.id))
          .map(user => ({
            id: user.id,
            email: user.email || "لا يوجد بريد إلكتروني",
            created_at: user.created_at
          }));
        
        setAdminUsers(filteredUsers);
      } else {
        setAdminUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching admin users:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل بيانات المشرفين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminData.email || !newAdminData.password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // إنشاء مستخدم جديد
      const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email: newAdminData.email,
        password: newAdminData.password,
        email_confirm: true
      });

      if (signUpError) throw signUpError;

      if (newUser && newUser.user) {
        // إضافة المستخدم كمشرف
        const { error: adminError } = await supabase
          .from("admin_users")
          .insert({
            user_id: newUser.user.id,
            role: "admin"
          });

        if (adminError) throw adminError;

        toast({
          title: "تم بنجاح",
          description: "تمت إضافة المشرف الجديد بنجاح",
        });

        // تحديث القائمة
        fetchAdminUsers();
        setCreateDialogOpen(false);
        setNewAdminData({ email: "", password: "" });
      }
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء المشرف الجديد",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordData.password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كلمة المرور الجديدة",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // تحديث كلمة المرور
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        resetPasswordData.id,
        { password: resetPasswordData.password }
      );

      if (updateError) throw updateError;

      toast({
        title: "تم بنجاح",
        description: "تم تحديث كلمة المرور بنجاح",
      });

      setResetPasswordDialogOpen(false);
      setResetPasswordData({ id: "", email: "", password: "" });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`هل أنت متأكد من حذف المشرف ${adminEmail}؟`)) {
      return;
    }

    try {
      // حذف المشرف من جدول admin_users
      const { error: deleteAdminError } = await supabase
        .from("admin_users")
        .delete()
        .eq("user_id", adminId);

      if (deleteAdminError) throw deleteAdminError;

      // حذف المستخدم من auth.users
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(adminId);

      if (deleteUserError) throw deleteUserError;

      toast({
        title: "تم بنجاح",
        description: "تم حذف المشرف بنجاح",
      });

      // تحديث القائمة
      fetchAdminUsers();
    } catch (error: any) {
      console.error("Error deleting admin user:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف المشرف",
        variant: "destructive",
      });
    }
  };

  const openResetPasswordDialog = (admin: AdminUser) => {
    setResetPasswordData({
      id: admin.id,
      email: admin.email,
      password: ""
    });
    setResetPasswordDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-trndsky-darkblue font-tajawal">إدارة المشرفين</h2>
        <Button onClick={() => setCreateDialogOpen(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> إضافة مشرف جديد
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500 font-tajawal">جاري تحميل البيانات...</p>
        </div>
      ) : adminUsers.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right font-tajawal">البريد الإلكتروني</TableHead>
                <TableHead className="text-right font-tajawal">تاريخ الإنشاء</TableHead>
                <TableHead className="text-center font-tajawal">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{new Date(admin.created_at).toLocaleString("ar-SA")}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResetPasswordDialog(admin)}
                        title="تغيير كلمة المرور"
                      >
                        <Key className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                        title="حذف المشرف"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-lg text-gray-500 font-tajawal">
            لا يوجد مشرفين حاليًا. أضف مشرفًا جديدًا باستخدام زر "إضافة مشرف جديد".
          </p>
        </div>
      )}

      {/* مربع حوار إضافة مشرف جديد */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مشرف جديد</DialogTitle>
            <DialogDescription>
              أدخل البريد الإلكتروني وكلمة المرور للمشرف الجديد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
              <Input
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                placeholder="example@example.com"
                type="email"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور</label>
              <Input
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                placeholder="كلمة المرور"
                type="password"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCreateAdmin} 
              disabled={isProcessing}
              className="ml-2"
            >
              {isProcessing ? "جاري الإضافة..." : "إضافة"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
              disabled={isProcessing}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مربع حوار تغيير كلمة المرور */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور</DialogTitle>
            <DialogDescription>
              أدخل كلمة المرور الجديدة للمشرف: {resetPasswordData.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
              <Input
                value={resetPasswordData.password}
                onChange={(e) => setResetPasswordData({...resetPasswordData, password: e.target.value})}
                placeholder="كلمة المرور الجديدة"
                type="password"
                dir="ltr"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleResetPassword} 
              disabled={isProcessing}
              className="ml-2"
            >
              {isProcessing ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setResetPasswordDialogOpen(false)}
              disabled={isProcessing}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
