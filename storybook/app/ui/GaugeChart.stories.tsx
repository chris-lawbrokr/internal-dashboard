import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GaugeChart } from "@/app/ui/GaugeChart";
import { chartColors } from "@/lib/chart-colors";

const meta: Meta<typeof GaugeChart> = {
  title: "App/UI/GaugeChart",
  component: GaugeChart,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    label: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    color: { control: "color" },
    href: { control: "text" },
  },
};

export default meta;

type Story = StoryObj<typeof GaugeChart>;

export const Default: Story = {
  args: {
    title: "Onboarding Health",
    label: "Good",
    value: 75,
    color: chartColors.purpleDark,
  },
};

export const WithLink: Story = {
  args: {
    title: "Performance Health",
    label: "Fair",
    value: 50,
    color: chartColors.purpleMedium,
    href: "#",
  },
};

export const Low: Story = {
  args: {
    title: "Website Health",
    label: "Poor",
    value: 25,
    color: chartColors.purpleLight,
  },
};

export const Full: Story = {
  args: {
    title: "System Health",
    label: "Excellent",
    value: 100,
    color: chartColors.green,
  },
};

export const Empty: Story = {
  args: {
    title: "No Data",
    label: "N/A",
    value: 0,
    color: chartColors.label,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <GaugeChart title="Onboarding Health" label="Good" value={75} color={chartColors.purpleDark} href="#" />
      <GaugeChart title="Performance Health" label="Fair" value={50} color={chartColors.purpleMedium} href="#" />
      <GaugeChart title="Website Health" label="Poor" value={25} color={chartColors.purpleLight} href="#" />
    </div>
  ),
};
