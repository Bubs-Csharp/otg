import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = await req.json();
    console.log("Yoco webhook received:", JSON.stringify(payload));

    const { type, payload: eventPayload } = payload;

    if (type === "payment.succeeded") {
      const { metadata, id: paymentId } = eventPayload;
      const bookingId = metadata?.booking_id;

      if (bookingId) {
        console.log("Processing successful payment for booking:", bookingId);

        // Update payment record
        const { error: paymentUpdateError } = await supabaseClient
          .from("payments")
          .update({
            status: "completed",
            payment_reference: paymentId,
            payment_method: eventPayload.paymentMethodDetails?.type || "card",
            updated_at: new Date().toISOString(),
          })
          .eq("booking_id", bookingId);

        if (paymentUpdateError) {
          console.error("Error updating payment:", paymentUpdateError);
        }

        // Update booking payment status
        const { error: bookingUpdateError } = await supabaseClient
          .from("bookings")
          .update({
            payment_status: "paid",
            payment_reference: paymentId,
            payment_method: eventPayload.paymentMethodDetails?.type || "card",
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId);

        if (bookingUpdateError) {
          console.error("Error updating booking:", bookingUpdateError);
        }

        console.log("Successfully processed payment for booking:", bookingId);
      }
    } else if (type === "payment.failed") {
      const { metadata } = eventPayload;
      const bookingId = metadata?.booking_id;

      if (bookingId) {
        console.log("Processing failed payment for booking:", bookingId);

        await supabaseClient
          .from("payments")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("booking_id", bookingId);

        await supabaseClient
          .from("bookings")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
