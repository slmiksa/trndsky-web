
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qsdwcplmgkuyweqynyyh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzZHdjcGxtZ2t1eXdlcXlueXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzIzMTEsImV4cCI6MjA2MDgwODMxMX0.blZuC1hLlRhexunjKyu_9Ha7sstDiWO9shp6qKv6NjM";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
