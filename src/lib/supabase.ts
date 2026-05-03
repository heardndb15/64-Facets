import { createClient } from "@supabase/supabase-js";

// Check if variables exist; if not, provide dummy non-crashing values.
// This prevents Next.js from throwing a runtime error on load for users testing the layout.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}
if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.");
}

/**
 * Supabase client singleton for client-side usage.
 * Uses the anon key and RLS policies for security.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
