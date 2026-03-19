import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PerformanceTab } from "@/app/(dashboard)/account/tabs/PerformanceTab";

const meta: Meta<typeof PerformanceTab> = {
  title: "App/Account/PerformanceTab",
  component: PerformanceTab,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof PerformanceTab>;

export const Default: Story = {
  render: () => (
    <div className="@container flex flex-col gap-4">
      <PerformanceTab />
    </div>
  ),
};
