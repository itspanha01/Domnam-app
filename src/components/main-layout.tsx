
"use client";

import { type ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
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
  LogOut,
  Loader2,
  MessageSquare,
  BarChart,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/context/language-context";
import { Logo } from "@/components/logo";


function Nav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: "/", label: t('dashboard'), icon: Home, tooltip: t('dashboard') },
    { href: "/farm-layout", label: t('farm_layout'), icon: LayoutGrid, tooltip: t('farm_layout') },
    { href: "/plant-catalog", label: t('plant_catalog'), icon: Sprout, tooltip: t('plant_catalog') },
    { href: "/yield-tracker", label: t('yield_tracker'), icon: BarChart, tooltip: t('yield_tracker') },
    { href: "/discussion", label: t('discussion'), icon: MessageSquare, tooltip: t('discussion') },
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

export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  if (!user) return null;
  
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.profilePicture} alt={`@${user.username}`} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {t('welcome_back_user')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <h1 className="text-xl font-headline font-semibold">Domnam</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarFooter>
          {/* Settings and Logout are now in the UserNav dropdown */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <UserNav />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
