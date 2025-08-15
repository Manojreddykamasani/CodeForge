import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nvalwyfjvowrtuohxdrs.supabase.co';
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YWx3eWZqdm93cnR1b2h4ZHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDIzMjAsImV4cCI6MjA2MDkxODMyMH0.CIZO3ud_w-3O8HfkG4SX3EeGah1oEPPtEswiPKRUetM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
