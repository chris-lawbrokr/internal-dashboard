"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function Home() {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchAll() {
      try {
        // Analytics (require start_date and end_date)
        const summary = await api("analytics/summary?start_date=2026-02-01&end_date=2026-03-30");
        console.log("analytics/summary", summary);

        const leads = await api("analytics/chart/leads?start_date=2026-02-01&end_date=2026-03-30");
        console.log("analytics/chart/leads", leads);

        // Date range used by all endpoints
        const dates = "start_date=2026-02-01&end_date=2026-03-30";

        // Accounts list
        const accounts = await api(`accounts?${dates}`);
        console.log("accounts", accounts);

        // Single account (law_firm_id=9 as example)
        const account = await api(`account?law_firm_id=9&${dates}`);
        console.log("account", account);

        // Account users
        const users = await api(`account/users?law_firm_id=9&${dates}`);
        console.log("account/users", users);

        // Performance
        const perfChart = await api(`account/performance/chart?law_firm_id=9&${dates}`);
        console.log("account/performance/chart", perfChart);

        const funnels = await api(`account/performance/funnels?law_firm_id=9&${dates}`);
        console.log("account/performance/funnels", funnels);

        // Website
        const website = await api(`account/website?law_firm_id=9&${dates}`);
        console.log("account/website", website);

        const links = await api(`account/website/links?law_firm_id=9&${dates}`);
        console.log("account/website/links", links);

        // Usage
        const usage = await api(`account/usage?law_firm_id=9&${dates}`);
        console.log("account/usage", usage);

        const usageUsers = await api(`account/usage/users?law_firm_id=9&${dates}`);
        console.log("account/usage/users", usageUsers);

        const usageDetails = await api(`account/usage/details?law_firm_id=9&${dates}`);
        console.log("account/usage/details", usageDetails);
      } catch (err) {
        console.error("API fetch error:", err);
      }
    }

    void fetchAll();
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Lawbrokr Internal Dashboard</h1>
      {user && <p className="text-gray-600">Signed in as {user.name}</p>}
      <button
        onClick={() => void logout()}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Sign out
      </button>
    </div>
  );
}
