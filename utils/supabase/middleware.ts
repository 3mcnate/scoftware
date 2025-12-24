import { Enums } from "@/types/database.types";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
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
	const { pathname } = request.nextUrl;
	const { data, error } = await supabase.auth.getClaims();
	if (!data || error) {
		if (isProtectedPath(pathname)) {
			return redirectResponse(
				request,
				`/login`,
				`next=${encodeURIComponent(pathname)}`,
			);
		}
		return response;
	}

	if (!data.claims) {
		return redirectResponse(
			request,
			`/auth-error?message=${encodeURIComponent("Couldn't get user details")}`,
		);
	}

	const role: Enums<"user_role"> = data.claims.app_role;

	if (role === "participant" && isGuidePath(pathname)) {
		return redirectResponse(request, "/participant");
	}

	if (role === "guide" && isAdminPath(pathname)) {
		return redirectResponse(request, "/guide");
	}

	if (isGuideRole(role) && isParticipantPath(pathname)) {
		return redirectResponse(request, "/guide");
	}

	return response;
};

const redirectResponse = (
	request: NextRequest,
	pathname: string,
	searchParams?: string,
) => {
	const url = request.nextUrl.clone();
	url.pathname = pathname;
	if (searchParams) {
		url.search = searchParams;
	}
	return NextResponse.redirect(url);
};

const protectedPathnames = [
	"/participant",
	"/admin",
	"/guide",
	"/dashboard",
] as const;

function isProtectedPath(pathname: string) {
	return protectedPathnames.some((p) => pathname.startsWith(p));
}

function isGuidePath(pathname: string) {
	return pathname.startsWith("/guide") || pathname.startsWith("/admin");
}

function isParticipantPath(pathname: string) {
	return pathname.startsWith("/participant");
}

function isAdminPath(pathname: string) {
	return pathname.startsWith("/admin");
}

function isGuideRole(role: Enums<"user_role">) {
	return role !== "participant";
}
