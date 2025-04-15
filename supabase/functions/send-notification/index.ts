
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();
    
    // Validate required fields
    if (!data.to || !data.subject || !data.html) {
      throw new Error("Missing required fields (to, subject, html)");
    }

    const result = await sendEmail(data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
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
