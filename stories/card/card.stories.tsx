import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card/card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
    },
    padding: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: "default",
    padding: "md",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">This is the card content area.</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Card footer</p>
      </CardFooter>
    </Card>
  ),
};

export const Outline: Story = {
  args: {
    variant: "outline",
    padding: "md",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Outline Card</CardTitle>
        <CardDescription>A card with only a border.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Content with a transparent background.</p>
      </CardContent>
    </Card>
  ),
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    padding: "md",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
        <CardDescription>No border or background.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Minimal styling, just spacing.</p>
      </CardContent>
    </Card>
  ),
};

export const SmallPadding: Story = {
  args: {
    variant: "default",
    padding: "sm",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
        <CardDescription>Uses small padding.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Tighter layout for dense UIs.</p>
      </CardContent>
    </Card>
  ),
};

export const LargePadding: Story = {
  args: {
    variant: "default",
    padding: "lg",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Spacious Card</CardTitle>
        <CardDescription>Uses large padding.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">More breathing room for the content.</p>
      </CardContent>
    </Card>
  ),
};
