import type { Route } from "./+types/home";
import { Head } from "../components/head";
import { List } from "../components/list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
  <>
  <div className="px-4 py-8 md:px-10 md:py-16">
  <List />
  </div>
  </>
);
}
