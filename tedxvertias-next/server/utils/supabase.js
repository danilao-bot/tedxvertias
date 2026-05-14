const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

// Use service role key for server-side operations (bypasses RLS)
// Fall back to anon key if service role key is not set
const supabaseKey = serviceRoleKey || anonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
}

if (!serviceRoleKey) {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon key. Server-side reads may be blocked by RLS.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;