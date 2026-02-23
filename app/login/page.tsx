import { Button } from "@/components/ui/button/button";

import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card/card";

export default function login() {
  return (
    <main className="h-screen w-screen flex items-center justify-center p-36">
      <div className="h-full w-full flex gap-8">
        <Card className="w-full">
          <CardHeader>
            <Image src="/images/Logo.svg" alt="Logo" height="30" width="117" />
          </CardHeader>
          <CardContent>
            <p className="font-sans font-normal not-italic text-xl leading-[125%] tracking-normal">
              Login to your account
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Log In</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
