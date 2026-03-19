import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LeadsWeekChart } from "@/app/(dashboard)/ui/LeadsWeekChart";

const meta: Meta<typeof LeadsWeekChart> = {
  title: "App/UI/LeadsWeekChart",
  component: LeadsWeekChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof LeadsWeekChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px] h-[350px]">
      <LeadsWeekChart />
    </div>
  ),
};
