import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Package,
  Clapperboard,
  Glasses,
  CalendarCheck,
  ArrowLeftFromLine,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import handleLogout from "@/utils/helpers";
import { ThemeToggle } from "../ThemeToggle";

const navItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Gestion Users", url: "/admin/users", icon: Users },
  { title: "Jury", url: "/admin/jurys", icon: Glasses },
  { title: "Gestion Films", url: "/admin/videos", icon: Clapperboard },
  { title: "Evenements", url: "/admin/events", icon: CalendarCheck },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()



  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Greetings, {localStorage.getItem("first_name")}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Toggle Theme">
            <div className="flex items-center w-full">
              <ThemeToggle />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back Home">
              <NavLink to="/">
                <ArrowLeftFromLine className="size-4" />
                <span>Back Home</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back Home">
              <button onClick={handleLogout} className="hover:cursor-pointer">
                  <LogOut className="size-4" />
                  <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
