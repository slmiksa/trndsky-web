
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, Key } from "lucide-react";
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
  username: string;
  created_at: string;
};

type AdminFormData = {
  username: string;
  password: string;
};

// Define the shape of the user object returned from getUser
type SupabaseUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    username?: string;
  };
  created_at: string;
};

export function AdminUsersManager() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState<AdminFormData>({ username: "", password: "" });
  const [resetPasswordData, setResetPasswordData] = useState<{ id: string; username: string; password: string }>({ id: "", username: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { supabaseAuth } = useAdminAuth();

  // تحميل المشرفين
  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // الحصول على قائمة المشرفين
      const { data: adminUsersData, error: adminUsersError } = await supabase
        .from("admin_users")
        .select("user_id")
        .order("created_at", { ascending: false });

      if (adminUsersError) throw adminUsersError;

      if (adminUsersData && adminUsersData.length > 0) {
        // نحتاج إلى الحصول على معلومات المستخدمين بشكل فردي
        const userPromises = adminUsersData.map(async (admin) => {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(admin.user_id);
          
          if (userError) {
            console.error(`Error fetching user with ID ${admin.user_id}:`, userError);
            return null;
          }
          
          if (!userData?.user) return null;
          
          return {
            id: userData.user.id,
            username: userData.user.user_metadata?.username || "مستخدم بدون اسم",
            created_at: userData.user.created_at
          };
        });
        
        const users = await Promise.all(userPromises);
        const validUsers = users.filter(user => user !== null) as AdminUser[];
        
        setAdminUsers(validUsers);
      } else {
        setAdminUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching admin users:", error);
      setError("حدث خطأ أثناء تحميل بيانات المشرفين");
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
    if (!newAdminData.username || !newAdminData.password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // إنشاء مستخدم جديد باستخدام التسجيل العادي
      const email = `${newAdminData.username}@admin.trndsky.com`;
      
      // استخدام التسجيل العادي بدلاً من API الإدارة
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newAdminData.password,
        options: {
          data: {
            username: newAdminData.username
          }
        }
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // إضافة المستخدم كمشرف
        const { error: adminError } = await supabase
          .from("admin_users")
          .insert({
            user_id: signUpData.user.id,
            role: "admin"
          });

        if (adminError) throw adminError;

        toast({
          title: "تم بنجاح",
          description: "تمت إضافة المشرف الجديد بنجاح",
        });

        // تسجيل الخروج للمستخدم الجديد المسجل
        await supabase.auth.signOut();
        
        // إعادة تسجيل الدخول للمستخدم الحالي إذا كان موجودًا
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // تحميل قائمة المشرفين
          fetchAdminUsers();
          setCreateDialogOpen(false);
          setNewAdminData({ username: "", password: "" });
        }
      }
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      setError(error.message || "حدث خطأ أثناء إنشاء المشرف الجديد");
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
      setError(null);

      // استخدام إعادة تعيين كلمة المرور بدلاً من تحديث المستخدم مباشرة
      const email = `${resetPasswordData.username}@admin.trndsky.com`;
      
      // إعادة تعيين كلمة المرور باستخدام البريد الإلكتروني
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/admin-reset-password`
        }
      );

      if (resetError) throw resetError;

      toast({
        title: "تم بنجاح",
        description: "تم إرسال رابط إعادة تعيين كلمة المرور بنجاح",
      });

      setResetPasswordDialogOpen(false);
      setResetPasswordData({ id: "", username: "", password: "" });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setError(error.message || "حدث خطأ أثناء تحديث كلمة المرور");
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminUsername: string) => {
    if (!confirm(`هل أنت متأكد من حذف المشرف ${adminUsername}؟`)) {
      return;
    }

    try {
      setError(null);
      // حذف المشرف من جدول admin_users أولاً
      const { error: deleteAdminError } = await supabase
        .from("admin_users")
        .delete()
        .eq("user_id", adminId);

      if (deleteAdminError) throw deleteAdminError;

      // لا نحاول حذف المستخدم نفسه من auth.users لأن ذلك يتطلب صلاحيات إدارية
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف المشرف من قائمة المشرفين بنجاح",
      });

      // تحديث القائمة
      fetchAdminUsers();
    } catch (error: any) {
      console.error("Error deleting admin user:", error);
      setError(error.message || "حدث خطأ أثناء حذف المشرف");
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
      username: admin.username,
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500 font-tajawal">جاري تحميل البيانات...</p>
        </div>
      ) : adminUsers.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right font-tajawal">اسم المستخدم</TableHead>
                <TableHead className="text-right font-tajawal">تاريخ الإنشاء</TableHead>
                <TableHead className="text-center font-tajawal">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.username}</TableCell>
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
                        onClick={() => handleDeleteAdmin(admin.id, admin.username)}
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

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة مشرف جديد</DialogTitle>
            <DialogDescription>
              أدخل اسم المستخدم وكلمة المرور للمشرف الجديد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
              <Input
                value={newAdminData.username}
                onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
                placeholder="اسم المستخدم"
                dir="rtl"
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

      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تغيير كلمة المرور</DialogTitle>
            <DialogDescription>
              أدخل كلمة المرور الجديدة للمشرف: {resetPasswordData.username}
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
