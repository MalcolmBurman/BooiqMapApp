import type { Route } from "./+types/properties";
import { DataTable } from "../components/dataTable";
import { Toaster } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Fastigheter" }, { name: "description", content: "" }];
}

export default function Properties() {
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          <DataTable />
        </div>
      </div>
      <Toaster position="bottom-left" />
    </>
  );
}
