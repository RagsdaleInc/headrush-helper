"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const userLabel =
    session?.user?.name ||
    session?.user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="hr-surface border-b text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-wide">
            Headrush Community Tool
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
            <Link href="/models" className="hover:text-zinc-900 dark:hover:text-white">
              Models
            </Link>
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <Link href="/admin" className="hover:text-zinc-900 dark:hover:text-white">
                  Admin
                </Link>
              </>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isSignedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="hr-outline-btn inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-zinc-700 dark:text-zinc-200"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open user menu"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold">
                    {userLabel.slice(0, 1)}
                  </span>
                )}
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="hr-surface absolute right-0 mt-2 w-64 rounded-lg border p-3 shadow-lg"
                >
                  <div className="mb-3 border-b border-zinc-200/80 pb-3 dark:border-zinc-800/80">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {session.user?.email ?? "Signed-in user"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Role: {session.user?.role ?? "FREE"}
                    </p>
                  </div>

                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Theme
                    </span>
                    <ThemeToggle />
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hr-outline-btn w-full rounded-md px-3 py-2 text-left text-sm text-zinc-900 dark:text-zinc-100"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <ThemeToggle />
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="hr-accent-btn rounded-md px-3 py-1.5 font-medium"
              >
                Sign in with Google
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
