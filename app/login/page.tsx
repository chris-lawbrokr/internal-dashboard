"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/lib/auth";

export default function Login() {
  const t = useTranslations("login");
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full p-8 sm:p-24 md:p-36 flex">
      <div className="flex-1 flex gap-24">
        <div className="w-full">
          <CardCentered className="w-full h-full">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <Image
                  src="/images/Logo.svg"
                  alt="Logo"
                  height="30"
                  width="117"
                  loading="eager"
                  style={{ height: "auto" }}
                />
                <CardDescription>{t("enterCredentials")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {error && (
                  <p className="text-sm text-status-error-border">{error}</p>
                )}
                <Input
                  id="email"
                  type="email"
                  label={t("email")}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <PasswordInput
                  id="password"
                  label={t("password")}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between mt-4">
                  <Checkbox id="remember" label={t("rememberMe")} />
                  <CardLink href="/login">{t("forgotPassword")}</CardLink>
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "..." : t("signIn")}
                </Button>
              </CardFooter>
            </form>
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
