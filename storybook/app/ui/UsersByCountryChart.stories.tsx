import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UsersByCountryChart } from "@/app/ui/UsersByCountryChart";

const meta: Meta<typeof UsersByCountryChart> = {
  title: "App/UI/UsersByCountryChart",
  component: UsersByCountryChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof UsersByCountryChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px] h-[350px]">
      <UsersByCountryChart />
    </div>
  ),
};
