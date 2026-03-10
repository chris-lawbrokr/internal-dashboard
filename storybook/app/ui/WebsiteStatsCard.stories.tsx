import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WebsiteStatsCard } from "@/app/ui/WebsiteStatsCard";

const meta: Meta<typeof WebsiteStatsCard> = {
  title: "App/UI/WebsiteStatsCard",
  component: WebsiteStatsCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof WebsiteStatsCard>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <WebsiteStatsCard />
    </div>
  ),
};
