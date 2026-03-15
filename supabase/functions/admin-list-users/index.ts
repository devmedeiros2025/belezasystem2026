import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization")!;

    // Verify caller is super_admin
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const { data: isSuperAdmin } = await callerClient.rpc("has_role", { _user_id: caller.id, _role: "super_admin" });
    if (!isSuperAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // List all auth users (paginated, up to 1000)
    const { data: { users }, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }

    // Map to relevant fields
    const mapped = (users || []).map((u) => {
      const providers = u.app_metadata?.providers || [];
      const provider = u.app_metadata?.provider || "email";
      const identities = u.identities || [];
      
      // Get Google-specific data if available
      const googleIdentity = identities.find((i: any) => i.provider === "google");
      const avatarUrl = googleIdentity?.identity_data?.avatar_url || u.user_metadata?.avatar_url || null;
      const fullName = googleIdentity?.identity_data?.full_name || u.user_metadata?.nome || u.user_metadata?.full_name || u.email;

      return {
        id: u.id,
        email: u.email,
        phone: u.phone,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        provider,
        providers,
        avatar_url: avatarUrl,
        full_name: fullName,
        is_google: providers.includes("google") || provider === "google",
      };
    });

    return new Response(JSON.stringify({ users: mapped }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
