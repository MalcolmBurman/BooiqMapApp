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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { forgetPassword } from "../lib/auth-client";
import { toast, Toaster } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Återställ lösenord
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Ange din e-postadress nedan för att återstella ditt lösenord
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                onClick={async () => {
                  setLoading(true);
                  const res = await forgetPassword({
                    email: email,
                    redirectTo: "http://localhost:5173/reset-password",
                    fetchOptions: {
                      onResponse(context) {
                        setLoading(false);
                        if (context.response?.status === 200) {
                          toast.success("E-post skickad");
                        }
                        if (context.response?.status === 400) {
                        }
                      },
                    },
                  });
                  console.log(res);
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Skicka </p>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            top: "calc(50vh + 7rem)",
          },
        }}
      />
    </>
  );
}
