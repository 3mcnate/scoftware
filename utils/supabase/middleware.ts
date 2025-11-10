import { Enums } from "@/types/database.types";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      },
    );

    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data, error } = await supabase.auth.getClaims();
    if (!data || error) {
      redirect("/");
    }

    if (!data.claims) {
      redirect(
        `/auth-error?message=${
          encodeURIComponent("Couldn't get user details")
        }`,
      );
    }

    const role: Enums<"user_role"> = data.claims.app_role;
    const { pathname } = request.nextUrl;

    if (
      role === "participant" &&
      (pathname.startsWith("/guide") || pathname.startsWith("/admin"))
    ) {
      return redirectRequest(request, "/participant");
    }

    if ((role === "guide" && (pathname.startsWith("/admin")))) {
      return redirectRequest(request, "/guide");
    }

    if (
      (role === "guide" ||
        role === "admin" || role === "superadmin") &&
      pathname.startsWith("/participant")
    ) {
      return redirectRequest(request, "/guide");
    }
  } catch {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

const redirectRequest = (request: NextRequest, pathname: string) => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
};
