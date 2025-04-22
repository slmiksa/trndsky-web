
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/components/AdminAuthContext";

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
    <Card>
      <CardHeader>
        <CardTitle>إدارة المدير الافتراضي</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              اسم المستخدم الجديد
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم الجديد"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور الجديدة
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور الجديدة"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              تأكيد كلمة المرور الجديدة
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="تأكيد كلمة المرور الجديدة"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
