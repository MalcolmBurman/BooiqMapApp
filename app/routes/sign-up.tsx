"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { signUp } from "../lib/auth-client";
import { Link } from "react-router";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    await signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      fetchOptions: {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: (ctx) => {
          toast.error("Användare med den här e-posten finns redan");
        },
        onSuccess: async () => {
          toast.success("Konto skapat, verifiera din e-postadress");
        },
      },
    });
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="z-50 rounded-md  max-w-md">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Registrera dig</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Ange din information för att skapa ett konto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">Förnamn</Label>
                  <Input
                    id="first-name"
                    placeholder="Olle"
                    required
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    value={firstName}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Efternamn</Label>
                  <Input
                    id="last-name"
                    placeholder="Eriksson"
                    required
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    value={lastName}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="epost@exempel.com"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignUp();
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleSignUp}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Registrera"
                )}
              </Button>
              <Button variant={"link"} asChild>
                <Link to="/sign-in">Logga in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            top: "calc(50vh + 16rem)",
          },
          duration: 10000,
        }}
      />
    </>
  );
}
