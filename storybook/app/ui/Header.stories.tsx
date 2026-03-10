import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "@/app/ui/Header";

const meta: Meta<typeof Header> = {
  title: "App/UI/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    sidebarOpen: { control: "boolean" },
    onMenuClick: { action: "menuClicked" },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    sidebarOpen: true,
  },
};

export const SidebarClosed: Story = {
  args: {
    sidebarOpen: false,
  },
};
