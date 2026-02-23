import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardCentered,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardLink,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px] p-8">
      <div className="flex flex-col gap-8">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Action</Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[380px] p-8">
      <CardContent>
        <p>A simple card with only content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithLink: Story = {
  render: () => (
    <Card className="w-[380px] p-8">
      <div className="flex flex-col gap-8">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You have 3 unread messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Check your inbox for the latest updates.</p>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Updated 2m ago</span>
            <CardLink href="#">View all</CardLink>
          </div>
        </CardFooter>
      </div>
    </Card>
  ),
};

export const Centered: Story = {
  render: () => (
    <div className="h-[500px] w-[400px]">
      <CardCentered className="w-full h-full">
        <CardHeader>
          <CardTitle>Centered Card</CardTitle>
          <CardDescription>
            Content is vertically centered within the card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This card fills its parent height and centers its children.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Action</Button>
        </CardFooter>
      </CardCentered>
    </div>
  ),
};

export const LoginCard: Story = {
  render: () => (
    <div className="h-[600px] w-[420px]">
      <CardCentered className="w-full h-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            id="sb-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
          />
          <PasswordInput
            id="sb-password"
            label="Password"
            placeholder="••••••••"
          />
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between">
            <Checkbox id="sb-remember" label="Remember me" />
            <CardLink href="#">Forgot password?</CardLink>
          </div>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </CardCentered>
    </div>
  ),
};
