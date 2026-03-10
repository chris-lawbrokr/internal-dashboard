import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GaugeChart } from "@/app/ui/GaugeChart";

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
    color: "#7c3aed",
  },
};

export const WithLink: Story = {
  args: {
    title: "Performance Health",
    label: "Fair",
    value: 50,
    color: "#a855f7",
    href: "#",
  },
};

export const Low: Story = {
  args: {
    title: "Website Health",
    label: "Poor",
    value: 25,
    color: "#d8b4fe",
  },
};

export const Full: Story = {
  args: {
    title: "System Health",
    label: "Excellent",
    value: 100,
    color: "#22c55e",
  },
};

export const Empty: Story = {
  args: {
    title: "No Data",
    label: "N/A",
    value: 0,
    color: "#9ca3af",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <GaugeChart title="Onboarding Health" label="Good" value={75} color="#7c3aed" href="#" />
      <GaugeChart title="Performance Health" label="Fair" value={50} color="#a855f7" href="#" />
      <GaugeChart title="Website Health" label="Poor" value={25} color="#d8b4fe" href="#" />
    </div>
  ),
};
