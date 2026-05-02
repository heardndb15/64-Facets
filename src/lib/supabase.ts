import { createClient } from "@supabase/supabase-js";

// Check if variables exist; if not, provide dummy non-crashing values.
// This prevents Next.js from throwing a runtime error on load for users testing the layout.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xxx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key";

/**
 * Supabase client singleton for client-side usage.
 * Uses the anon key and RLS policies for security.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
