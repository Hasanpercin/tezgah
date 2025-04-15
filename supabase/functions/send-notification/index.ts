
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface ReservationStatusUpdateRequest {
  reservationId: string;
  status: 'Onaylandı' | 'Beklemede' | 'İptal';
  customerEmail: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  tableInfo?: string;
}

// This is a placeholder for a real email service implementation
// In a production environment, you would use a service like SendGrid, Mailgun, or Resend
const sendEmail = async (data: NotificationRequest) => {
  console.log("Email notification would be sent:", data);
  
  // Here you would implement actual email sending
  // Example with Resend:
  // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  // await resend.emails.send({
  //   from: data.from || 'Restoran <onboarding@resend.dev>',
  //   to: [data.to],
  //   subject: data.subject,
  //   html: data.html,
  // });
  
  return { success: true, message: "Email notification simulated (no actual email sent)" };
};

// Generate HTML for reservation status update emails
const generateReservationStatusEmail = (req: ReservationStatusUpdateRequest) => {
  const statusColor = req.status === 'Onaylandı' ? '#28a745' : 
                     req.status === 'İptal' ? '#dc3545' : '#ffc107';
                     
  const statusText = req.status === 'Onaylandı' ? 'onaylandı' : 
                    req.status === 'İptal' ? 'iptal edildi' : 'beklemede';
                    
  const statusMessage = req.status === 'Onaylandı' ? 
      'Rezervasyonunuz başarıyla onaylanmıştır. Belirtilen tarih ve saatte sizi ağırlamaktan memnuniyet duyacağız.' : 
      req.status === 'İptal' ? 
      'Rezervasyonunuz iptal edilmiştir. Başka bir zaman sizi ağırlamaktan memnuniyet duyarız.' : 
      'Rezervasyonunuz şu an beklemededir. En kısa sürede size dönüş yapacağız.';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Rezervasyon Durumu</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .status-badge { 
            display: inline-block; 
            padding: 6px 12px; 
            background-color: ${statusColor}; 
            color: white; 
            border-radius: 4px; 
            font-weight: bold;
          }
          .reservation-details { 
            background-color: #f9f9f9; 
            border: 1px solid #ddd; 
            padding: 15px; 
            border-radius: 4px;
            margin: 20px 0;
          }
          .footer { text-align: center; font-size: 14px; color: #777; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Rezervasyon Durumunuz</h2>
            <p>Sayın ${req.customerName},</p>
          </div>
          
          <p>Rezervasyonunuz <span class="status-badge">${req.status}</span> olarak ${statusText}.</p>
          
          <p>${statusMessage}</p>
          
          <div class="reservation-details">
            <h3>Rezervasyon Bilgileri</h3>
            <p><strong>Rezervasyon ID:</strong> ${req.reservationId}</p>
            <p><strong>Tarih:</strong> ${req.date}</p>
            <p><strong>Saat:</strong> ${req.time}</p>
            <p><strong>Kişi Sayısı:</strong> ${req.guests}</p>
            ${req.tableInfo ? `<p><strong>Masa:</strong> ${req.tableInfo}</p>` : ''}
          </div>
          
          <p>Herhangi bir sorunuz varsa, lütfen bizimle iletişime geçin.</p>
          
          <div class="footer">
            <p>Restoran Adı - İletişim: +90 554 434 60 68</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    
    // Handle reservation status update notifications
    if (data.type === 'reservation_status') {
      const statusReq = data as ReservationStatusUpdateRequest;
      
      if (!statusReq.reservationId || !statusReq.status || !statusReq.customerEmail) {
        throw new Error("Missing required fields for reservation status update");
      }
      
      const html = generateReservationStatusEmail(statusReq);
      const subject = `Rezervasyon Durumu: ${statusReq.status} | Rezervasyon #${statusReq.reservationId.substring(0, 8)}`;
      
      const emailResult = await sendEmail({
        to: statusReq.customerEmail,
        subject: subject,
        html: html,
        from: 'Restoran <rezervasyon@restoran.com>'
      });
      
      return new Response(JSON.stringify(emailResult), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    // Handle regular notification emails
    else {
      // Validate required fields
      if (!data.to || !data.subject || !data.html) {
        throw new Error("Missing required fields (to, subject, html)");
      }
      
      const result = await sendEmail(data as NotificationRequest);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
