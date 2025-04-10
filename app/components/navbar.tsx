import { Link } from "react-router";
import { Button } from "../components/ui/button";
export function Navbar() {
  return (
    <nav className="flex gap-2">
      <Button asChild>
        <Link to="/">Karta</Link>
      </Button>
      <Button asChild>
        <Link to="/properties">Fastigheter</Link>
      </Button>
    </nav>
  );
}
