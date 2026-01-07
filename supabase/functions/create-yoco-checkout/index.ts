import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  booking_id: string;
  amount: number;
  currency: string;
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );

    // Get user from JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { booking_id, amount, currency, success_url, cancel_url, metadata }: CheckoutRequest = await req.json();
    
    console.log("Creating Yoco checkout for booking:", booking_id, "amount:", amount);

    // Validate amount (Yoco expects amount in cents)
    const amountInCents = Math.round(amount * 100);

    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) {
      console.error("YOCO_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Yoco checkout session
    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: currency || "ZAR",
        successUrl: success_url,
        cancelUrl: cancel_url,
        failureUrl: cancel_url,
        metadata: {
          booking_id,
          user_id: user.id,
          ...metadata,
        },
      }),
    });

    if (!yocoResponse.ok) {
      const errorText = await yocoResponse.text();
      console.error("Yoco API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const yocoData = await yocoResponse.json();
    console.log("Yoco checkout created:", yocoData.id);

    // Create payment record
    const { error: paymentError } = await supabaseClient.from("payments").insert({
      booking_id,
      user_id: user.id,
      amount,
      currency: currency || "ZAR",
      status: "pending",
      yoco_checkout_id: yocoData.id,
      metadata: { checkout_url: yocoData.redirectUrl },
    });

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
    }

    return new Response(
      JSON.stringify({
        checkout_id: yocoData.id,
        redirect_url: yocoData.redirectUrl,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in create-yoco-checkout:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
