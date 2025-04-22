import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";

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
      
      // Parse JSON strings to properly typed objects
      const parsedData: AboutContent = {
        ...data,
        stats: Array.isArray(data.stats) ? data.stats.map((stat: any) => ({
          number: stat.number || "",
          label: stat.label || ""
        })) : [],
        team_members: Array.isArray(data.team_members) ? data.team_members.map((member: any) => ({
          name: member.name || "",
          title: member.title || "",
          image: member.image || ""
        })) : []
      };
      
      setContent(parsedData);
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

  const addStat = () => {
    if (!content) return;
    setContent({
      ...content,
      stats: [...content.stats, { number: "", label: "" }]
    });
  };

  const removeStat = (index: number) => {
    if (!content) return;
    const newStats = [...content.stats];
    newStats.splice(index, 1);
    setContent({ ...content, stats: newStats });
  };

  const addTeamMember = () => {
    if (!content) return;
    setContent({
      ...content,
      team_members: [...content.team_members, { name: "", title: "", image: "" }]
    });
  };

  const removeTeamMember = (index: number) => {
    if (!content) return;
    const newTeamMembers = [...content.team_members];
    newTeamMembers.splice(index, 1);
    setContent({ ...content, team_members: newTeamMembers });
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
              value={content?.title || ""}
              onChange={(e) => content && setContent({ ...content, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">العنوان الفرعي</label>
            <Input
              value={content?.subtitle || ""}
              onChange={(e) => content && setContent({ ...content, subtitle: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">صورة الغلاف</label>
            <div className="flex items-center gap-4">
              <Input
                value={content?.cover_image || ""}
                onChange={(e) => content && setContent({ ...content, cover_image: e.target.value })}
                placeholder="رابط الصورة"
              />
              <ImageUpload
                onUpload={(url) => content && setContent({ ...content, cover_image: url })}
                label="رفع صورة الغلاف"
              />
            </div>
            {content.cover_image && (
              <img
                src={content.cover_image}
                alt="صورة الغلاف"
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">الرؤية</label>
            <Textarea
              value={content?.vision || ""}
              onChange={(e) => content && setContent({ ...content, vision: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">الرسالة</label>
            <Textarea
              value={content?.mission || ""}
              onChange={(e) => content && setContent({ ...content, mission: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">الإحصائيات</h3>
            <Button onClick={addStat} className="flex items-center gap-2">
              إضافة إحصائية
            </Button>
          </div>
          <div className="grid gap-4">
            {content?.stats?.map((stat, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-start border p-4 rounded-lg relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-white"
                  onClick={() => removeStat(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </Button>
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
            <div className="flex items-center gap-4">
              <Input
                value={content?.team_title || ""}
                onChange={(e) => content && setContent({ ...content, team_title: e.target.value })}
                className="max-w-xs"
              />
              <Button onClick={addTeamMember} className="flex items-center gap-2">
                إضافة عضو
              </Button>
            </div>
          </div>
          <div className="grid gap-6">
            {content?.team_members?.map((member, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-4 items-start border p-4 rounded-lg relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -top-2 -right-2 bg-white"
                  onClick={() => removeTeamMember(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18"/>
                    <path d="m6 6 12 12"/>
                  </svg>
                </Button>
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
                  <div className="flex items-center gap-2">
                    <Input
                      value={member.image}
                      onChange={(e) => handleTeamMemberChange(index, "image", e.target.value)}
                    />
                    <ImageUpload
                      onUpload={(url) => handleTeamMemberChange(index, "image", url)}
                      label="رفع صورة"
                    />
                  </div>
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="mt-2 max-h-20 rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
