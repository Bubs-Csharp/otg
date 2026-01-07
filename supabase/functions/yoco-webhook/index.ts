import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify Yoco webhook signature using HMAC-SHA256
async function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature || !secret) {
    console.error("Missing signature or secret for webhook verification");
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(payload)
    );

    const computedSignature = Array.from(new Uint8Array(signatureBytes))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Yoco may send signature with or without prefix
    const providedSig = signature.replace(/^sha256=/, "").toLowerCase();
    const isValid = computedSignature.toLowerCase() === providedSig;

    if (!isValid) {
      console.error("Webhook signature mismatch");
    }

    return isValid;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get("YOCO_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("YOCO_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook verification not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const signature = req.headers.get("X-Yoco-Signature") || req.headers.get("x-yoco-signature");
    const isValidSignature = await verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValidSignature) {
      console.error("Invalid webhook signature - rejecting request");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Webhook signature verified successfully");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const payload = JSON.parse(rawBody);
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
