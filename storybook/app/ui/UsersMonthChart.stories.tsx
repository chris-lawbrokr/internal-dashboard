import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UsersMonthChart } from "@/app/(dashboard)/ui/UsersMonthChart";

const meta: Meta<typeof UsersMonthChart> = {
  title: "App/UI/UsersMonthChart",
  component: UsersMonthChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof UsersMonthChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px] h-[300px]">
      <UsersMonthChart />
    </div>
  ),
};
