import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OverviewTab } from "@/app/(dashboard)/accounts/tabs/OverviewTab";

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
      <OverviewTab />
    </div>
  ),
};
