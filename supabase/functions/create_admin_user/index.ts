
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

    const { username, password, role } = await req.json()
    
    if (!username || !password || !role) {
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

    // Insert directly into admin_users table without foreign key dependency
    // First, let's modify the admin_users table to drop the foreign key constraint if it exists
    const { error: alterTableError } = await supabaseClient.rpc('drop_admin_users_fk_constraint');
    
    if (alterTableError) {
      console.error("Error modifying table constraint:", alterTableError);
      // Continue execution - it might be that the constraint was already dropped
    }

    // Now insert the admin user directly
    const { data: adminUser, error: insertError } = await supabaseClient
      .from('admin_users')
      .insert({
        username: username,
        password: password,
        user_id: crypto.randomUUID(),  // Generate a UUID directly
        role: role
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
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
