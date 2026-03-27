import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OverviewTab } from "@/app/(dashboard)/accounts/account/tabs/OverviewTab";

const meta: Meta<typeof OverviewTab> = {
  title: "App/Account/OverviewTab",
  component: OverviewTab,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof OverviewTab>;

export const Default: Story = {
  render: () => (
    <div className="@container flex flex-col gap-4">
      <OverviewTab
        account={{
          name: "Smith Law Firm",
          username: "smithlaw",
          website: "www.smithlawfirm.com",
          employees: 25,
          location: "Los Angeles, CA",
          marketing_agency: null,
          marketing_spend: null,
          contract_term: "annual",
          activation_date: "2024-10-30",
          next_payment_date: "2026-10-25",
          status: "active",
          onboarding_health: "good",
          performance_health: "fair",
          website_health: "poor",
          practice_areas: ["Personal Injury", "Corporate"],
          integrations: ["ClioGrow", "Lawmatics"],
          tech_stack: ["Clio Manage"],
          features: ["Clips", "Ad Manager"],
        }}
        users={[
          { name: "John Smith", role: "Admin", email: "john@smithlaw.com", created_date: "2026-01-13" },
          { name: "Jane Doe", role: "Internal", email: "jane@smithlaw.com", created_date: "2026-02-01" },
        ]}
      />
    </div>
  ),
};
