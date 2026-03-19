import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GaugeChart } from "@/app/(dashboard)/ui/GaugeChart";

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
    color: "var(--color-chart-purple-dark)",
  },
};

export const WithLink: Story = {
  args: {
    title: "Performance Health",
    label: "Fair",
    value: 50,
    color: "var(--color-chart-purple-medium)",
    href: "#",
  },
};

export const Low: Story = {
  args: {
    title: "Website Health",
    label: "Poor",
    value: 25,
    color: "var(--color-chart-purple-light)",
  },
};

export const Full: Story = {
  args: {
    title: "System Health",
    label: "Excellent",
    value: 100,
    color: "var(--color-chart-green)",
  },
};

export const Empty: Story = {
  args: {
    title: "No Data",
    label: "N/A",
    value: 0,
    color: "var(--color-chart-label)",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <GaugeChart title="Onboarding Health" label="Good" value={75} color="var(--color-chart-purple-dark)" href="#" />
      <GaugeChart title="Performance Health" label="Fair" value={50} color="var(--color-chart-purple-medium)" href="#" />
      <GaugeChart title="Website Health" label="Poor" value={25} color="var(--color-chart-purple-light)" href="#" />
    </div>
  ),
};
