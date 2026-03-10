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
  argTypes: {
    open: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Open: Story = {
  render: () => (
    <div className="relative h-[400px]">
      <Sidebar open={true} />
    </div>
  ),
};

export const Closed: Story = {
  render: () => (
    <div className="relative h-[400px]">
      <Sidebar open={false} />
    </div>
  ),
};
