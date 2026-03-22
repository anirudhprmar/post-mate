"use client";

import { Button } from "~/components/ui/button";
import { authClient } from "~/server/better-auth/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <header className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <Link
          prefetch={true}
          className="group inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
          href="/"
        >
          <span className="text-xl font-bold tracking-tight">CSV2PDF</span>
        </Link>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-xl">
          <CardHeader className="space-y-1 pb-6 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Button
                variant="outline"
                className="relative h-11 w-full gap-2 border-border/50 bg-background/50 hover:bg-accent/50 transition-all active:scale-[0.98]"
                disabled={loading}
                onClick={async () => {
                  try {
                    await authClient.signIn.social(
                      {
                        provider: "google",
                        callbackURL: returnTo ?? "/dashboard",
                      },
                      {
                        onRequest: () => setLoading(true),
                        onResponse: () => setLoading(false),
                        onError: (ctx) => {
                          setLoading(false);
                          console.error("Sign-in failed:", ctx.error);
                          toast.error(ctx.error.message || "Failed to sign in");
                        },
                      },
                    );
                  } catch (error) {
                    setLoading(false);
                    console.error("Authentication error:", error);
                    toast.error("An unexpected error occurred");
                  }
                }}
              >
                {loading ? (
                   <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 256 262"
                    className="shrink-0"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                )}
                Continue with Google
              </Button>
            </div>
          </CardContent>
          <div className="border-t border-border/50 p-6 pt-0 text-center">
            <p className="px-8 text-xs text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </Card>
      </motion.section>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}