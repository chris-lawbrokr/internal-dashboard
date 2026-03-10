import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CountrySessionsChart } from "@/app/ui/CountrySessionsChart";

const meta: Meta<typeof CountrySessionsChart> = {
  title: "App/UI/CountrySessionsChart",
  component: CountrySessionsChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof CountrySessionsChart>;

export const Default: Story = {
  render: () => (
    <div className="w-[500px]">
      <CountrySessionsChart />
    </div>
  ),
};
