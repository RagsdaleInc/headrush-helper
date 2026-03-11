"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="hr-surface mx-auto max-w-md rounded-lg border p-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Use Google sign-in to access personalized and role-based features.
      </p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="hr-accent-btn mt-6 w-full rounded-md px-4 py-2 font-medium"
      >
        Continue with Google
      </button>
    </div>
  );
}
