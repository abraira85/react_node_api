import { NextRequest, NextResponse } from "next/server";
import { defaultLanguage, supportedLanguages } from "@/lib/translations";

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);

    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;
    const pathnameHasLocale = supportedLanguages.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    if (pathnameHasLocale) {
        const urlParts = pathname.split("/");
        const selectedLocale = urlParts[1];
        requestHeaders.set("x-language", selectedLocale);

        const response = NextResponse.next({
            request: {
                // New request headers
                headers: requestHeaders,
            },
        });
        response.headers.set("x-language", selectedLocale);

        return response;
    }

    // Redirect if there is no locale
    request.nextUrl.pathname = `/${defaultLanguage}${pathname}`;

    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!api|_next/static|_next/image|images|content|favicon.ico).*)",
        // "/((?!_next).*)",
        // Optional: only run on root (/) URL
        // '/'
    ],
};
