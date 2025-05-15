import { redirect } from "react-router";

export const loader = () => {
  return redirect("/sign-in");
};

export default function Index() {
  return <></>;
}
