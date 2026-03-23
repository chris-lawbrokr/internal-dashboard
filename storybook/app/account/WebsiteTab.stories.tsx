import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WebsiteTab } from "@/app/(dashboard)/accounts/account/tabs/WebsiteTab";

const meta: Meta<typeof WebsiteTab> = {
  title: "App/Account/WebsiteTab",
  component: WebsiteTab,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof WebsiteTab>;

export const Default: Story = {
  render: () => (
    <div className="@container flex flex-col gap-4">
      <WebsiteTab />
    </div>
  ),
};
