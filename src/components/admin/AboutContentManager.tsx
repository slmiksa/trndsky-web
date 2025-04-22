
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

type StatItem = {
  number: string;
  label: string;
};

type TeamMember = {
  name: string;
  title: string;
  image: string;
};

type AboutContent = {
  id: number;
  title: string;
  subtitle: string;
  vision: string | null;
  mission: string | null;
  team_title: string;
  stats: StatItem[];
  team_members: TeamMember[];
  cover_image: string | null;
  updated_at: string | null;
};

export function AboutContentManager() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error: any) {
      console.error("Error fetching about content:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب المحتوى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("about_content")
        .update({
          title: content.title,
          subtitle: content.subtitle,
          vision: content.vision,
          mission: content.mission,
          team_title: content.team_title,
          stats: content.stats,
          team_members: content.team_members,
          cover_image: content.cover_image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      if (error) throw error;
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error: any) {
      console.error("Error saving about content:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    if (!content) return;
    const newTeamMembers = [...content.team_members];
    newTeamMembers[index] = { ...newTeamMembers[index], [field]: value };
    setContent({ ...content, team_members: newTeamMembers });
  };

  const handleStatChange = (index: number, field: keyof StatItem, value: string) => {
    if (!content) return;
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-red-600">لم يتم العثور على المحتوى</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-trndsky-darkblue">تحرير صفحة من نحن</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block font-medium mb-1">العنوان الرئيسي</label>
            <Input
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">العنوان الفرعي</label>
            <Input
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">الرؤية</label>
            <Textarea
              value={content.vision || ""}
              onChange={(e) => setContent({ ...content, vision: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">الرسالة</label>
            <Textarea
              value={content.mission || ""}
              onChange={(e) => setContent({ ...content, mission: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">صورة الغلاف</label>
            <Input
              value={content.cover_image || ""}
              onChange={(e) => setContent({ ...content, cover_image: e.target.value })}
              placeholder="رابط الصورة"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">الإحصائيات</h3>
          <div className="grid gap-4">
            {content.stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">الرقم</label>
                  <Input
                    value={stat.number}
                    onChange={(e) => handleStatChange(index, "number", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">النص</label>
                  <Input
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, "label", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">أعضاء الفريق</h3>
            <Input
              value={content.team_title}
              onChange={(e) => setContent({ ...content, team_title: e.target.value })}
              className="max-w-xs"
            />
          </div>
          <div className="grid gap-6">
            {content.team_members.map((member, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 items-start">
                <div>
                  <label className="block font-medium mb-1">الاسم</label>
                  <Input
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">المنصب</label>
                  <Input
                    value={member.title}
                    onChange={(e) => handleTeamMemberChange(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">الصورة</label>
                  <Input
                    value={member.image}
                    onChange={(e) => handleTeamMemberChange(index, "image", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
