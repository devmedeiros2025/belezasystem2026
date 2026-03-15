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

    const { email, password, nome, role } = await req.json();
    if (!email || !password || !nome) {
      return new Response(JSON.stringify({ error: "email, password, nome required" }), { status: 400, headers: corsHeaders });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    
    // Create user with auto-confirm
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome },
    });

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });

    // Assign role if provided (override the default trigger)
    if (role && data.user) {
      // Wait briefly for the trigger to create the default role
      await new Promise((r) => setTimeout(r, 500));
      
      // Try update first, then upsert if no row exists yet
      const { data: existing } = await adminClient
        .from("user_roles")
        .select("id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (existing) {
        await adminClient.from("user_roles").update({ role }).eq("user_id", data.user.id);
      } else {
        await adminClient.from("user_roles").insert({ user_id: data.user.id, role });
      }
    }

    return new Response(JSON.stringify({ success: true, userId: data.user?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
