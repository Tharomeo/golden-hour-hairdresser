import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  servicePrice: string;
  date: string;
  time: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      clientName, 
      clientEmail, 
      clientPhone,
      serviceName, 
      servicePrice,
      date, 
      time 
    }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation to:", clientEmail);

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Salão de Beleza <onboarding@resend.dev>",
        to: [clientEmail],
        subject: "Confirmação de Agendamento - Salão de Beleza",
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%);
                padding: 40px 20px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                color: #1a1a1a;
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #ffffff;
                padding: 40px 30px;
                border-left: 1px solid #e5e5e5;
                border-right: 1px solid #e5e5e5;
              }
              .booking-details {
                background: #f9f9f9;
                border-left: 4px solid #D4AF37;
                padding: 20px;
                margin: 25px 0;
                border-radius: 4px;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e5e5e5;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .detail-label {
                font-weight: 600;
                color: #666;
              }
              .detail-value {
                color: #1a1a1a;
                font-weight: 500;
              }
              .price {
                color: #D4AF37;
                font-size: 24px;
                font-weight: bold;
              }
              .footer {
                background: #f9f9f9;
                padding: 30px;
                text-align: center;
                border-radius: 0 0 12px 12px;
                border-top: 1px solid #e5e5e5;
              }
              .contact-info {
                margin: 15px 0;
                color: #666;
              }
              .button {
                display: inline-block;
                background: #D4AF37;
                color: #1a1a1a;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✨ Agendamento Confirmado!</h1>
            </div>
            
            <div class="content">
              <h2>Olá, ${clientName}!</h2>
              <p>Seu agendamento foi confirmado com sucesso. Estamos ansiosos para recebê-la!</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Serviço:</span>
                  <span class="detail-value">${serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Horário:</span>
                  <span class="detail-value">${time}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Telefone:</span>
                  <span class="detail-value">${clientPhone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Valor:</span>
                  <span class="price">${servicePrice}</span>
                </div>
              </div>

              <p><strong>Informações importantes:</strong></p>
              <ul>
                <li>Por favor, chegue com 10 minutos de antecedência</li>
                <li>Em caso de cancelamento, avisar com 24h de antecedência</li>
                <li>Traga uma foto de referência se tiver alguma ideia específica</li>
              </ul>
            </div>
            
            <div class="footer">
              <div class="contact-info">
                <p><strong>Salão de Beleza</strong></p>
                <p>📍 Rua das Flores, 123 - Jardins, São Paulo</p>
                <p>📞 (11) 99999-9999</p>
                <p>✉️ contato@salao.com</p>
              </div>
              <p style="font-size: 12px; color: #999; margin-top: 20px;">
                Caso precise alterar seu agendamento, entre em contato conosco.
              </p>
            </div>
          </body>
        </html>
      `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.json();
      throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
    }

    const emailData = await emailResponse.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify(emailData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
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
