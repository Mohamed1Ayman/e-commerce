"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    setError("");

    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      setIsSigningOut(false);
      setError("Unable to sign out. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-end">
      <button
        className="inline-flex items-center gap-2 rounded-md border border-[#dfe5e0] bg-white px-3 py-2 text-sm font-medium text-[#425047] transition hover:border-[#198754] hover:text-[#198754] disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        <LogOut className="size-4" aria-hidden="true" />
        {isSigningOut ? "Signing out..." : "Log out"}
      </button>
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
