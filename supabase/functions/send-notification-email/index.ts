
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  requestType: "trial" | "project" | "purchase" | "contact";
  requestDetails: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, requestType, requestDetails }: EmailRequest = await req.json();
    
    // Always use the configured admin email
    const adminEmail = "info@trndsky.com";
    
    // Build email content based on request type
    let emailHtml = "";
    
    if (requestType === "trial") {
      emailHtml = `
        <h1>طلب تجربة جديد للبرمجيات</h1>
        <p>تم استلام طلب تجربة جديد من:</p>
        <ul>
          <li><strong>اسم الشركة / العميل:</strong> ${requestDetails.company_name}</li>
          <li><strong>رقم الواتساب:</strong> ${requestDetails.whatsapp}</li>
          <li><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-SA')}</li>
        </ul>
        <p>يرجى التواصل مع العميل في أقرب وقت ممكن.</p>
      `;
    } else if (requestType === "project") {
      emailHtml = `
        <h1>طلب برمجة خاصة جديد</h1>
        <p>تم استلام طلب برمجة خاصة جديد من:</p>
        <ul>
          <li><strong>الاسم:</strong> ${requestDetails.name}</li>
          <li><strong>البريد الإلكتروني:</strong> ${requestDetails.email || 'غير متوفر'}</li>
          <li><strong>الهاتف:</strong> ${requestDetails.phone || 'غير متوفر'}</li>
          <li><strong>عنوان المشروع:</strong> ${requestDetails.title}</li>
          <li><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-SA')}</li>
        </ul>
        <h2>تفاصيل المشروع:</h2>
        <p>${requestDetails.description}</p>
      `;
    } else if (requestType === "purchase") {
      emailHtml = `
        <h1>طلب شراء برمجية جديد</h1>
        <p>تم استلام طلب شراء برمجية جديد من:</p>
        <ul>
          <li><strong>اسم الشركة / العميل:</strong> ${requestDetails.company_name}</li>
          <li><strong>رقم الواتساب:</strong> ${requestDetails.whatsapp}</li>
          <li><strong>البرمجية المطلوبة:</strong> ${requestDetails.software_title || `رقم البرمجية: ${requestDetails.software_id}`}</li>
          <li><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-SA')}</li>
        </ul>
        <p>يرجى التواصل مع العميل في أقرب وقت ممكن.</p>
      `;
    } else if (requestType === "contact") {
      emailHtml = `
        <h1>رسالة جديدة من نموذج الاتصال</h1>
        <p>تم استلام رسالة جديدة من:</p>
        <ul>
          <li><strong>الاسم:</strong> ${requestDetails.name}</li>
          <li><strong>البريد الإلكتروني:</strong> ${requestDetails.email || 'غير متوفر'}</li>
          <li><strong>الهاتف:</strong> ${requestDetails.phone || 'غير متوفر'}</li>
          <li><strong>الموضوع:</strong> ${requestDetails.subject}</li>
          <li><strong>تاريخ الرسالة:</strong> ${new Date().toLocaleString('ar-SA')}</li>
        </ul>
        <h2>محتوى الرسالة:</h2>
        <p>${requestDetails.message}</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "TRNDSKY Notifications <info@trndsky.com>",
      to: [adminEmail],
      subject: subject,
      html: emailHtml,
      text: "يبدو أن عميلك المستخدم لا يدعم رسائل HTML. يرجى التحقق من لوحة التحكم للحصول على تفاصيل الطلب.",
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Email notification sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
