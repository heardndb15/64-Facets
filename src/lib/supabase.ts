import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client singleton for client-side usage.
 * Uses the anon key and RLS policies for security.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
