import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function redirectTo(
    request: NextRequest,
    response: NextResponse,
    path: string
    ) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    // Bawa cookie session yang baru diperbarui ikut ke halaman tujuan
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
}

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                );
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                );
            },
        },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    if (!user && !isAuthPage) {
        return redirectTo(request, response, "/login");
    }

    if (user && isAuthPage) {
        return redirectTo(request, response, "/");
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};