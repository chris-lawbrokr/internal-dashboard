import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input, PasswordInput } from "@/components/ui/input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => (
    <div className="w-[320px]">
      <Input id="sb-default" placeholder="Enter text..." />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[320px]">
      <Input id="sb-label" label="Email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[320px]">
      <Input id="sb-disabled" label="Email" placeholder="you@example.com" disabled />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="w-[320px]">
      <PasswordInput id="sb-password" label="Password" placeholder="••••••••" />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="w-[320px] flex flex-col gap-4">
      <Input id="sb-text" label="Text" placeholder="Enter text..." />
      <Input id="sb-email" label="Email" type="email" placeholder="you@example.com" />
      <Input id="sb-number" label="Number" type="number" placeholder="0" />
      <PasswordInput id="sb-pass" label="Password" placeholder="••••••••" />
    </div>
  ),
};
