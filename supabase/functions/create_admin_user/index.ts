
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { username, password, user_id, role } = await req.json()
    
    if (!username || !password || !user_id || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabaseClient
      .from('admin_users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (checkError) {
      throw new Error(`Error checking existing user: ${checkError.message}`);
    }
    
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // First insert a dummy user in auth.users to satisfy the foreign key constraint
    // Note: This is a workaround for the foreign key constraint - we could also
    // modify the database schema to remove this constraint if desired
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: `${username}_${Date.now()}@example.com`, // Using timestamp to ensure uniqueness
      password: password,
      email_confirm: true
    });

    if (authError) {
      console.error("Error creating auth user:", authError);
      return new Response(
        JSON.stringify({ error: `Could not create user: ${authError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Now use the real auth user ID for admin_users table
    const realUserId = authUser.user.id;

    // Create the admin user with the auth user ID
    const { data: adminUser, error: adminError } = await supabaseClient.rpc('create_admin_user', {
      p_username: username,
      p_password: password,
      p_user_id: realUserId,
      p_role: role
    });

    if (adminError) {
      console.error("Database insert error:", adminError);
      // Try to clean up the auth user if admin creation failed
      try {
        await supabaseClient.auth.admin.deleteUser(realUserId);
      } catch (cleanupError) {
        console.error("Error cleaning up auth user:", cleanupError);
      }
      throw adminError;
    }

    return new Response(
      JSON.stringify({ success: true, data: adminUser }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in create_admin_user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
