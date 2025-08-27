import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// this is implemented to redirect the user into login page when they open these given pages without signin
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // this is also implementing the same feature in the auth
  const { userId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();

    return redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};