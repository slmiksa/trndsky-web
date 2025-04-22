
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

    // Execute SQL to create the required function
    const { error: createFunctionError } = await supabaseClient.rpc(
      'exec_sql',
      { 
        sql: `
          CREATE OR REPLACE FUNCTION public.drop_admin_users_fk_constraint()
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            constraint_exists boolean;
          BEGIN
            -- Check if the constraint exists
            SELECT EXISTS (
              SELECT 1
              FROM information_schema.table_constraints
              WHERE constraint_name = 'admin_users_user_id_fkey'
                AND table_name = 'admin_users'
            ) INTO constraint_exists;
            
            IF constraint_exists THEN
              EXECUTE 'ALTER TABLE public.admin_users DROP CONSTRAINT admin_users_user_id_fkey';
            END IF;
          END;
          $$;
          
          -- Also create a wrapper function to execute arbitrary SQL
          CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$;
        `
      }
    );

    if (createFunctionError) {
      throw new Error(`Error creating database functions: ${createFunctionError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Database functions created successfully" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error creating database functions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
