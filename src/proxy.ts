import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 "proxy" convention (the renamed middleware). Edge-safe: uses the
// `authorized` callback in auth.config.ts to gate /admin behind an ADMIN role.
const { auth } = NextAuth(authConfig);

/**
 * The `/prototypes/*` static design explorations stay in the repo for
 * reference and are served by the dev app, but are hidden on production
 * deployments (returned as 404). Preview deployments keep them available.
 */
export default function proxy(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/prototypes")) {
    if (process.env.VERCEL_ENV === "production") {
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.next();
  }
  // Delegate everything else (i.e. /admin) to the Auth.js middleware.
  return (auth as unknown as (req: NextRequest, ev: NextFetchEvent) => ReturnType<typeof auth>)(
    req,
    ev,
  );
}

export const config = {
  matcher: ["/admin/:path*", "/prototypes/:path*"],
};
