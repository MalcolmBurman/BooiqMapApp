import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "../components/ui/sidebar";
import { Map, List } from "lucide-react";
import { useSession, signOut } from "../lib/auth-client";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useEffect } from "react";

const items = [
  {
    title: "Karta",
    url: "/home",
    icon: Map,
  },
  {
    title: "Fastigheter",
    url: "/properties",
    icon: List,
  },
];

export function Navbar() {
  const { data: session } = useSession();

  const url = window.location.href;
  if (!url.includes("/home") && !url.includes("/properties") && session) {
    window.location.href = "/home";
  }

  useEffect(() => {
    if (!url.includes("/home") && !url.includes("/properties") && session) {
      window.location.href = "/home";
    }
  }, [session]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>Booiq</SidebarHeader>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <span>
                      <item.icon width={20} height={20} />
                    </span>
                    <span className="">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <span className="flex items-center gap-2">
          <img src="./booiq.png" alt="Booiq" className="size-10 rounded-sm" />
          {session?.user.name}
        </span>
        <Button
          variant={"outline"}
          className=""
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/";
                },
              },
            })
          }
        >
          <LogOut />
          Logga ut
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
