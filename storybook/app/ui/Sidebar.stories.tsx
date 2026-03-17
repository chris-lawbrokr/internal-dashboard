import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar } from "@/app/ui/Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "App/UI/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[500px]">
      <Sidebar />
    </div>
  ),
};
