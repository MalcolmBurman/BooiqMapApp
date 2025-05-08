import type { Route } from "./+types/home";
import { Maplibre } from "../components/map";
import { Toaster } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Karta" }, { name: "description", content: "" }];
}

export default function Home() {
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          <Maplibre />
        </div>
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{ style: { marginLeft: "12rem" } }}
      />
    </>
  );
}
