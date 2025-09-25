import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Client for public/anon usage (safe on frontend)
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Admin client with service role key (server-side only)
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
