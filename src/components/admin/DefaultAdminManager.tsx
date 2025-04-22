
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/components/AdminAuthContext";
import { LockKeyhole, User, Save } from "lucide-react";

export function DefaultAdminManager() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateDefaultAdmin } = useAdminAuth();
  
  useEffect(() => {
    // Load current values from localStorage or use defaults
    const storedUsername = localStorage.getItem("default-admin-username") || "admin";
    setUsername(storedUsername);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Save to localStorage to update the DEFAULT_ADMIN
      localStorage.setItem("default-admin-username", username);
      localStorage.setItem("default-admin-password", password);
      
      // Call the updateDefaultAdmin function to apply changes immediately
      if (updateDefaultAdmin) {
        updateDefaultAdmin(username, password);
      }
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات المدير الافتراضي وتطبيق التغييرات فوراً",
      });
      
      // Reset password fields
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث بيانات المدير الافتراضي",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="border border-gray-100 shadow-md overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-trndsky-blue/5 to-trndsky-teal/5 pointer-events-none"></div>
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
        <CardTitle className="flex items-center gap-2 text-trndsky-blue">
          <LockKeyhole className="h-5 w-5" />
          إدارة المدير الافتراضي
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              اسم المستخدم الجديد
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم الجديد"
              className="border-gray-200 focus:border-trndsky-teal focus:ring-trndsky-teal/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              <LockKeyhole className="h-4 w-4" />
              كلمة المرور الجديدة
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور الجديدة"
              className="border-gray-200 focus:border-trndsky-teal focus:ring-trndsky-teal/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              <LockKeyhole className="h-4 w-4" />
              تأكيد كلمة المرور الجديدة
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="تأكيد كلمة المرور الجديدة"
              className="border-gray-200 focus:border-trndsky-teal focus:ring-trndsky-teal/20"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-r from-trndsky-blue to-trndsky-teal hover:from-trndsky-darkblue hover:to-trndsky-blue text-white transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">جاري الحفظ...</span>
            ) : (
              <span className="flex items-center gap-2">
                حفظ التغييرات
                <Save className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
