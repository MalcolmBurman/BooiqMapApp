import type { Route } from "./+types/properties";
import { DataTable } from "../components/dataTable";
import { Toaster } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Fastigheter" }, { name: "description", content: "" }];
}

export default function Properties() {
  return (
    <>
      <div className="h-full">
        <div className="ml-[12rem] flex items-center justify-center h-full">
          <DataTable />
        </div>
      </div>
      <Toaster
        position="bottom-left"
        toastOptions={{ style: { marginLeft: "12rem" } }}
      />
    </>
  );
}
