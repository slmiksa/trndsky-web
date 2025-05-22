
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variables
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
    console.log("Received email notification request");
    
    const { subject, requestType, requestDetails }: EmailRequest = await req.json();
    
    // Always use the configured admin email
    const adminEmail = "info@trndsky.com";
    
    console.log("Request type:", requestType);
    console.log("Request details:", JSON.stringify(requestDetails));
    
    // Build admin email content based on request type
    let adminEmailHtml = "";
    
    if (requestType === "trial") {
      adminEmailHtml = `
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
      adminEmailHtml = `
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
      adminEmailHtml = `
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
      adminEmailHtml = `
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

    console.log("Sending admin notification email to:", adminEmail);
    
    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "TRNDSKY Notifications <info@mail.trndsky.com>",
      to: [adminEmail],
      subject: subject,
      html: adminEmailHtml,
      text: "يبدو أن عميلك المستخدم لا يدعم رسائل HTML. يرجى التحقق من لوحة التحكم للحصول على تفاصيل الطلب.",
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Check if customer email exists to send confirmation
    const customerEmail = requestDetails.email || null;
    
    if (customerEmail) {
      console.log("Sending confirmation email to customer:", customerEmail);
      
      // Build customer email content based on request type
      let customerEmailHtml = "";
      let customerEmailSubject = "";
      
      if (requestType === "project") {
        customerEmailSubject = "تأكيد استلام طلب برمجة خاصة - TRNDSKY";
        customerEmailHtml = `
          <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e3a8a;">شكراً لك ${requestDetails.name}</h1>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">لقد تم استلام طلبك للبرمجة الخاصة بنجاح.</p>
            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0369a1;">تفاصيل طلبك:</h3>
              <p><strong>عنوان المشروع:</strong> ${requestDetails.title}</p>
              <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleString('ar-SA')}</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">سيقوم فريقنا بدراسة طلبك والتواصل معك في أقرب وقت ممكن لمناقشة التفاصيل والخطوات القادمة.</p>
            
            <p style="font-size: 16px; line-height: 1.6;">إذا كان لديك أي استفسارات إضافية، يرجى التواصل معنا عبر البريد الإلكتروني info@trndsky.com</p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>TRNDSKY - خدمات برمجية احترافية</p>
              <p>&copy; ${new Date().getFullYear()} جميع الحقوق محفوظة</p>
            </div>
          </div>
        `;
      } else if (requestType === "contact") {
        customerEmailSubject = "تأكيد استلام رسالتك - TRNDSKY";
        customerEmailHtml = `
          <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #f8fafc; border-radius: 12px; border-top: 5px solid #0891b2;">
            <div style="text-align: center; margin-bottom: 30px; padding-top: 20px;">
              <img src="https://qsdwcplmgkuyweqynyyh.supabase.co/storage/v1/object/public/assets/logo.png" alt="TRNDSKY Logo" style="max-width: 180px; margin-bottom: 20px;">
              <h1 style="color: #1e3a8a; font-size: 24px;">شكراً لتواصلك معنا ${requestDetails.name}</h1>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">لقد تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
              
              <div style="background-color: #f0f9ff; border-right: 4px solid #0891b2; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #0c4a6e; font-size: 18px;">تفاصيل رسالتك:</h3>
                <p style="margin-bottom: 8px;"><strong>الموضوع:</strong> ${requestDetails.subject}</p>
                <p style="margin-bottom: 8px;"><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-SA')}</p>
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6;">نشكرك على اهتمامك بخدماتنا ونتطلع للتواصل معك قريباً.</p>
            
            <div style="margin-top: 30px; background-color: #f1f5f9; padding: 15px; border-radius: 8px;">
              <p style="font-size: 16px; margin-bottom: 10px;"><strong>للتواصل السريع:</strong></p>
              <p style="margin-bottom: 5px;">البريد الإلكتروني: info@trndsky.com</p>
              <p style="margin-bottom: 5px;">الهاتف: +966123456789</p>
              <p>الموقع الإلكتروني: <a href="https://trndsky.com" style="color: #0891b2; text-decoration: none;">www.trndsky.com</a></p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #64748b; font-size: 14px;">
              <p>TRNDSKY - حلول برمجية مبتكرة لتطوير أعمالك</p>
              <div style="margin: 15px 0;">
                <a href="https://facebook.com/trndsky" style="color: #0891b2; text-decoration: none; margin: 0 10px;">فيسبوك</a>
                <a href="https://twitter.com/trndsky" style="color: #0891b2; text-decoration: none; margin: 0 10px;">تويتر</a>
                <a href="https://linkedin.com/company/trndsky" style="color: #0891b2; text-decoration: none; margin: 0 10px;">لينكد إن</a>
              </div>
              <p>&copy; ${new Date().getFullYear()} شركة ترندسكاي - جميع الحقوق محفوظة</p>
            </div>
          </div>
        `;
      }
      
      if (customerEmailHtml) {
        const customerEmailResponse = await resend.emails.send({
          from: "TRNDSKY <info@mail.trndsky.com>",
          to: [customerEmail],
          subject: customerEmailSubject,
          html: customerEmailHtml,
        });
        
        console.log("Customer confirmation email sent:", customerEmailResponse);
      }
    }

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
