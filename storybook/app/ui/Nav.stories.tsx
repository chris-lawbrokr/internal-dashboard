import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nav } from "@/app/(dashboard)/ui/Nav";

const meta: Meta<typeof Nav> = {
  title: "App/UI/Nav",
  component: Nav,
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

type Story = StoryObj<typeof Nav>;

export const Default: Story = {
  render: () => (
    <div className="relative h-[500px]">
      <Nav />
    </div>
  ),
};
