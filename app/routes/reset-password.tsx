"use client";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { use, useState, useEffect } from "react";
import { Loader2, Key } from "lucide-react";
import { resetPassword } from "../lib/auth-client";
import { Toaster } from "sonner";

export default function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setToken(searchParams.get("token"));
  }, []);

  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Nytt lösenord</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Ange ett nytt lösenord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Lösenord"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Bekräfta Lösenord</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Bekräfta Lösenord"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={async () => {
                  if (!token) {
                    window.location.href = "/sign-in";
                    return;
                  }
                  if (password !== passwordConfirmation) {
                    alert("Lösenorden matchar inte");
                    return;
                  }

                  await resetPassword({
                    token: token,
                    newPassword: password,
                    fetchOptions: {
                      onError: () => {
                        window.location.href = "/sign-in";
                      },
                      onSuccess: async () => {
                        window.location.href = "/sign-in";
                      },
                    },
                  });
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Spara </p>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="bottom-left" />
    </>
  );
}
