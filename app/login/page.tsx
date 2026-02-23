import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardCentered,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Login() {
  return (
    <div className="h-screen w-full p-12 sm:p-36 flex">
      <div className="flex-1 flex gap-24">
        <div className="w-full">
          <CardCentered className="w-full h-full">
            <CardHeader>
              <Image
                src="/images/Logo.svg"
                alt="Logo"
                height="30"
                width="117"
              />
              <CardDescription>
                Enter your credentials to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign in</Button>
            </CardFooter>
          </CardCentered>
        </div>
        <div className="hidden lg:flex w-full items-center justify-center">
          <Image
            src="/images/graphics/login.svg"
            alt="Logo"
            height="494"
            width="608"
          />
        </div>
      </div>
    </div>
  );
}
