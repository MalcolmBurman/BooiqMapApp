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
import { Loader2, Key } from "lucide-react";
import { signIn } from "../lib/auth-client";
import { Link } from "react-router";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx) => {
          console.log(ctx);
          setLoading(true);
        },
        onResponse: (ctx) => {
          setLoading(false);
          if (ctx.response?.status === 200) {
            window.location.href = "/home";
          }
          if (ctx.response?.status === 401 || ctx.response?.status === 400) {
            toast.error("Fel e-post eller lösenord");
          }
          if (ctx.response?.status === 403) {
            toast.error("Verifiera din e-postadress");
          }
          if (ctx.response?.status === 400) {
            toast.error("fe");
          }
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Logga in</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Ange din e-postadress nedan för att logga in på ditt konto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Lösenord</Label>
                  <Button className="ml-auto p-0 h-0" variant={"link"} asChild>
                    <Link to="/forgot-password">Glömt lösenord?</Link>
                  </Button>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="Lösenord"
                  autoComplete="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignIn();
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                onClick={handleSignIn}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Logga in </p>
                )}
              </Button>
              <Button variant={"link"} asChild>
                <Link to="/sign-up">Skapa konto</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            top: "calc(50vh + 11rem)",
          },
        }}
      />
    </>
  );
}
