import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/expenses/:path*",
    "/analytics/:path*",
    "/api/expenses/:path*",
    "/api/analytics/:path*",
    "/api/scan-receipt/:path*",
  ],
};