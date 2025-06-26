"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import {
  Home,
  LayoutGrid,
  Sprout,
  Settings,
  User
} from "lucide-react";
import { Logo } from "./logo";

function Nav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home, tooltip: "Dashboard" },
    { href: "/farm-layout", label: "Farm Layout", icon: LayoutGrid, tooltip: "Farm Layout" },
    { href: "/plant-catalog", label: "Plant Catalog", icon: Sprout, tooltip: "Plant Catalog" },
  ];

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Button asChild variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}


export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">Domnam</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
              <SidebarMenuItem>
                  <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                  </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                  </Button>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
