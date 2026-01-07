import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  name: string;
  email: string;
  title?: string;
  specialization?: string;
  temporaryPassword: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client for user creation
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if caller is admin
    const { data: adminRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .single();

    if (!adminRole) {
      return new Response(JSON.stringify({ error: "Only admins can invite practitioners" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, title, specialization, temporaryPassword }: InviteRequest = await req.json();

    if (!name || !email || !temporaryPassword) {
      return new Response(JSON.stringify({ error: "Name, email, and temporary password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Creating practitioner account for ${email}`);

    // 1. Create the user account with temporary password
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || "",
      },
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      return new Response(JSON.stringify({ error: createUserError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`User created with ID: ${newUser.user.id}`);

    // 2. Create the practitioner record linked to user
    const { data: practitioner, error: practitionerError } = await supabaseAdmin
      .from("practitioners")
      .insert({
        name,
        title: title || null,
        specialization: specialization || null,
        user_id: newUser.user.id,
        is_active: false, // Inactive until onboarding is complete
      })
      .select()
      .single();

    if (practitionerError) {
      console.error("Error creating practitioner:", practitionerError);
      // Rollback: delete the user
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(JSON.stringify({ error: practitionerError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Practitioner created with ID: ${practitioner.id}`);

    // 3. Add practitioner role to user
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: newUser.user.id,
        role: "practitioner",
      });

    if (roleError) {
      console.error("Error adding role:", roleError);
    }

    // 4. Create invitation record with token
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from("practitioner_invitations")
      .insert({
        email,
        name,
        title,
        specialization,
        practitioner_id: practitioner.id,
        invited_by: callerUser.id,
      })
      .select()
      .single();

    if (invitationError) {
      console.error("Error creating invitation:", invitationError);
    }

    // 5. Create empty practitioner profile
    const { error: profileError } = await supabaseAdmin
      .from("practitioner_profiles")
      .insert({
        practitioner_id: practitioner.id,
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    // 6. Send invitation email
    const appUrl = Deno.env.get("SUPABASE_URL")?.includes("localhost") 
      ? "http://localhost:5173"
      : `https://${Deno.env.get("SUPABASE_URL")?.split("//")[1]?.split(".")[0]}.lovableproject.com`;
    
    // Use a simple fallback for the app URL
    const onboardingUrl = `${appUrl.replace('supabase.co', 'lovableproject.com')}/practitioner/onboarding?token=${invitation?.token || ''}`;

    console.log(`Sending invite email to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "Impilo Yami <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Impilo Yami - Complete Your Practitioner Profile",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Impilo Yami Health Services</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${name},</h2>
            
            <p>You've been invited to join Impilo Yami as a healthcare practitioner. We're excited to have you on board!</p>
            
            <p>Your temporary login credentials are:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            </div>
            
            <p><strong>Important:</strong> Please change your password after your first login for security.</p>
            
            <p>To complete your practitioner profile and start accepting appointments, please log in and complete the onboarding process:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${onboardingUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Complete Your Profile</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">This invitation expires in 7 days. If you have any questions, please contact our admin team.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Impilo Yami Health Services. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        practitioner,
        invitation: invitation ? { id: invitation.id, token: invitation.token } : null,
        message: `Invitation sent to ${email}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-practitioner-invite:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
