
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "@/components/UserAuthContext";
import { Input } from "@/components/ui/input";
import { User, LockKeyhole, ArrowRight } from "lucide-react";

const Auth = () => {
  const { user, signIn, signUp } = useUserAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.fullName);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-trndsky-blue to-trndsky-darkblue"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-trndsky-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-60 -right-60 w-96 h-96 bg-trndsky-teal/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-trndsky-teal to-trndsky-blue flex items-center justify-center shadow-lg">
            <User size={40} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-8 text-center font-tajawal text-white">
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <Input
                type="text"
                placeholder="الاسم الكامل"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full text-right font-tajawal bg-white/10 text-white placeholder:text-white/70"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <Input
              type="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-right font-tajawal bg-white/10 text-white placeholder:text-white/70"
              required
            />
          </div>
          
          <div className="relative">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full text-right font-tajawal bg-white/10 text-white placeholder:text-white/70"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-300 font-tajawal text-sm text-right bg-red-500/10 p-3 rounded-lg backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-white/90 text-trndsky-blue py-4 rounded-xl font-tajawal text-lg transition-all flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              "جاري المعالجة..."
            ) : (
              <>
                {isLogin ? "دخول" : "إنشاء حساب"}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/80 hover:text-white text-sm underline decoration-white/30 transition-all font-tajawal"
          >
            {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ سجل دخول"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-white/80 hover:text-white text-sm underline decoration-white/30 transition-all font-tajawal"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
