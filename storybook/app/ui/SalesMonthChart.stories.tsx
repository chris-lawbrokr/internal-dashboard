import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SalesMonthChart } from "@/app/(dashboard)/ui/charts/SalesMonthChart";

const meta: Meta<typeof SalesMonthChart> = {
  title: "App/UI/SalesMonthChart",
  component: SalesMonthChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof SalesMonthChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px] h-[350px]">
      <SalesMonthChart />
    </div>
  ),
};
