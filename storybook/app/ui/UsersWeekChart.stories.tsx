import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UsersWeekChart } from "@/app/(dashboard)/ui/charts/UsersWeekChart";

const meta: Meta<typeof UsersWeekChart> = {
  title: "App/UI/UsersWeekChart",
  component: UsersWeekChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof UsersWeekChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px] h-[350px]">
      <UsersWeekChart />
    </div>
  ),
};
