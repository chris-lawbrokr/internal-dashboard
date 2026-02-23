import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CardCentered,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
              />
              <PasswordInput
                id="password"
                label="Password"
                placeholder="••••••••"
              />
            </CardContent>
            <CardFooter>
              <Checkbox id="remember" label="Remember me" />
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
