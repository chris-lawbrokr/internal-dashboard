import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LineChart } from "@/app/(dashboard)/ui/LineChart";

const meta: Meta<typeof LineChart> = {
  title: "App/UI/LineChart",
  component: LineChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof LineChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[500px] h-[300px]">
      <LineChart />
    </div>
  ),
};
