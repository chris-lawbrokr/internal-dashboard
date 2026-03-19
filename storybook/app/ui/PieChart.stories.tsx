import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PieChart } from "@/app/(dashboard)/ui/charts/PieChart";

const meta: Meta<typeof PieChart> = {
  title: "App/UI/PieChart",
  component: PieChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[200px] h-[200px]">
      <PieChart />
    </div>
  ),
};
