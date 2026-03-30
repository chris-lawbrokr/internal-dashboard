"use client";

import { type SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import {
  CardCentered,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardLink,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
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
            <form onSubmit={(e) => void handleSubmit(e)}>
              <CardHeader>
                <Image
                  src="/images/Logo.svg"
                  alt="Logo"
                  height={30}
                  width={117}
                  loading="eager"
                  style={{ height: "auto" }}
                />
                <CardDescription>Enter your credentials</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {error && (
                  <p className="text-sm text-status-error-border">{error}</p>
                )}
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                <PasswordInput
                  id="password"
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between mt-4">
                  <Checkbox id="remember" label="Remember me" />
                  <CardLink href="/login">Forgot password?</CardLink>
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </CardCentered>
        </div>
        <div className="hidden lg:flex w-full items-center justify-center">
          <Image
            src="/images/graphics/login.svg"
            alt="Logo"
            height={494}
            width={608}
            draggable={false}
            className="select-none"
          />
        </div>
      </div>
    </div>
  );
}
