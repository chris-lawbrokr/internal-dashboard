"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  CardCentered,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardLink,
} from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const t = useTranslations("login");

  return (
    <div className="h-screen w-full p-8 sm:p-24 md:p-36 flex">
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
                {t("enterCredentials")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                label={t("email")}
                placeholder="you@example.com"
              />
              <PasswordInput
                id="password"
                label={t("password")}
                placeholder="••••••••"
              />
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <Checkbox id="remember" label={t("rememberMe")} />
                <CardLink href="/login">{t("forgotPassword")}</CardLink>
              </div>
              <Button className="w-full">{t("signIn")}</Button>
            </CardFooter>
          </CardCentered>
        </div>
        <div className="hidden lg:flex w-full items-center justify-center">
          <Image
            src="/images/graphics/login.svg"
            alt="Logo"
            height="494"
            width="608"
            draggable={false}
            className="select-none"
          />
        </div>
      </div>
    </div>
  );
}
