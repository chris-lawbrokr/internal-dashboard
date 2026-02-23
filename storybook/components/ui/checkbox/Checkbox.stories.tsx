import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <Checkbox id="sb-default" />,
};

export const WithLabel: Story = {
  render: () => <Checkbox id="sb-label" label="Remember me" />,
};

export const Checked: Story = {
  render: () => <Checkbox id="sb-checked" label="I agree to the terms" defaultChecked />,
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox id="sb-disabled-unchecked" label="Disabled unchecked" disabled />
      <Checkbox id="sb-disabled-checked" label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};
