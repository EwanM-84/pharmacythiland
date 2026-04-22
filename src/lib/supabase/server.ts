import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-side admin client (service role — bypasses RLS)
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// Server-side client using cookies (respects RLS, used in Server Components / Route Handlers)
export async function createServerClient() {
  const { createServerClient: createSsrClient, parseCookieHeader } = await import(
    "@supabase/ssr"
  );
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createSsrClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (parseCookieHeader(cookieStore.toString()) ?? []).map((c) => ({
            name: c.name,
            value: c.value ?? "",
          }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Can't set cookies in Server Components — handled by middleware
          }
        },
      },
    }
  );
}
