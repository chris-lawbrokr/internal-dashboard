import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  StatCard,
  VisitsResponsesChart,
  ConversionRateCard,
  ConversionRatesOverPeriodsChart,
  FunnelsTable,
} from "@/app/ui/PerformanceCharts";

const meta: Meta = {
  title: "App/UI/PerformanceCharts",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj;

export const Stat: Story = {
  render: () => (
    <div className="w-[300px]">
      <StatCard
        title="Total Visits"
        value="4,268"
        change="10%"
        sparkData={[15, 18, 12, 20, 14, 16, 11]}
      />
    </div>
  ),
};

export const VisitsResponses: Story = {
  render: () => (
    <div className="w-[600px]">
      <VisitsResponsesChart />
    </div>
  ),
};

export const ConversionRate: Story = {
  render: () => (
    <div className="w-[400px]">
      <ConversionRateCard />
    </div>
  ),
};

export const ConversionRatesOverPeriods: Story = {
  render: () => (
    <div className="w-[500px]">
      <ConversionRatesOverPeriodsChart />
    </div>
  ),
};

export const Funnels: Story = {
  render: () => (
    <div className="w-[600px]">
      <FunnelsTable />
    </div>
  ),
};
