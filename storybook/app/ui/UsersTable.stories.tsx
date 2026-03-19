import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UsersTable } from "@/app/(dashboard)/ui/UsersTable";

const meta: Meta<typeof UsersTable> = {
  title: "App/UI/UsersTable",
  component: UsersTable,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof UsersTable>;

export const Default: Story = {
  render: () => <UsersTable />,
};
