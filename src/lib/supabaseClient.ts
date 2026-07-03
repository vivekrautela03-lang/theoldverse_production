import { createClient, SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (clientInstance) return clientInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "Supabase credentials missing from environment variables. Initializing dummy client for build compatibility."
    );
    // Return dummy client to prevent crash during build static page generation / compilation
    clientInstance = createClient("https://dummy-project.supabase.co", "dummy-anon-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return clientInstance;
  }

  clientInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return clientInstance;
}

// Export a proxy that forwards all properties and methods to the lazily initialized client instance.
// This preserves the exact import usage "import { supabaseAdmin } from './supabaseClient'" without rewriting other files.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
