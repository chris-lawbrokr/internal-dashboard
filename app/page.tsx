"use client";

import { useAuth } from "@/lib/auth";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Lawbrokr Internal Dashboard</h1>
      {user && <p className="text-gray-600">Signed in as {user.name}</p>}
      <button
        onClick={logout}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Sign out
      </button>
    </div>
  );
}
