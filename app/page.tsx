"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function Home() {
  const { user, logout, getAccessToken } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchAll() {
      try {
        const dates = "start_date=2026-02-01&end_date=2026-03-30";

        const summary = await api(
          `admin/analytics/summary?${dates}`,
          getAccessToken,
        );
        console.log("analytics/summary", summary);

        const leads = await api(
          `admin/analytics/chart/leads?${dates}`,
          getAccessToken,
        );
        console.log("analytics/chart/leads", leads);

        const accounts = await api(`admin/accounts?${dates}`, getAccessToken);
        console.log("accounts", accounts);

        const account = await api(
          `admin/account?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account", account);

        const users = await api(
          `admin/account/users?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/users", users);

        const perfChart = await api(
          `admin/account/performance/chart?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/performance/chart", perfChart);

        const funnels = await api(
          `admin/account/performance/funnels?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/performance/funnels", funnels);

        const website = await api(
          `admin/account/website?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/website", website);

        const links = await api(
          `admin/account/website/links?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/website/links", links);

        const usage = await api(
          `admin/account/usage?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/usage", usage);

        const usageUsers = await api(
          `admin/account/usage/users?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/usage/users", usageUsers);

        const usageDetails = await api(
          `admin/account/usage/details?law_firm_id=9&${dates}`,
          getAccessToken,
        );
        console.log("account/usage/details", usageDetails);
      } catch (err) {
        console.error("API fetch error:", err);
      }
    }
    void fetchAll();
  }, [user, getAccessToken]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-semibold">Lawbrokr Internal Dashboard</h1>
        {user && (
          <p className="text-gray-600 m-0">
            Signed in as {user.first_name} {user.last_name}
          </p>
        )}
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
