import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (parseCookieHeader(request.headers.get("cookie") ?? "") ?? []).map((c) => ({
            name: c.name,
            value: c.value ?? "",
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ---- Admin routes: require admin role ----
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login?next=/admin", request.url));
    }
    // Check admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ---- Customer-only routes: require any auth ----
  const customerRoutes = ["/account", "/checkout"];
  const isCustomerRoute = customerRoutes.some((r) => pathname.startsWith(r));
  if (isCustomerRoute && !user) {
    return NextResponse.redirect(
      new URL(`/auth/login?next=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // ---- Auth pages: redirect if already logged in ----
  if (pathname.startsWith("/auth/") && user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/webhooks).*)",
  ],
};
