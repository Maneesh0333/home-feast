"use client";

import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Wallet,
  User,
  Settings,
  Star,
  LayoutGrid,
  ChefHat,
  Users,
  ShieldCheck,
  CreditCard,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/Auth/useLogout";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

const navItems = {
  Cook: [
    {
      title: "Main",
      items: [
        {
          title: "Overview",
          icon: <LayoutDashboard size={18} />,
          href: "/overview",
        },
        { title: "Orders", icon: <ClipboardList size={18} />, href: "/orders" },
        { title: "Menu", icon: <Utensils size={18} />, href: "/menu" },
        { title: "Plans", icon: <CreditCard size={18} />, href: "/plans" },
        { title: "Todays Meal", icon: <Menu size={18} />, href: "/today-menu" },
        { title: "Reviews", icon: <Star size={18} />, href: "/reviews" },
      ],
    },
    {
      title: "Finance",
      items: [
        { title: "Earnings", icon: <Wallet size={18} />, href: "/earnings" },
        {
          title: "Subscribers",
          icon: <User size={18} />,
          href: "/subscribers",
        },
      ],
    },
    {
      title: "Account",
      items: [
        { title: "Profile", icon: <User size={18} />, href: "/profile" },
        { title: "Settings", icon: <Settings size={18} />, href: "/settings" },
      ],
    },
  ],

  Admin: [
    {
      title: "Main",
      items: [
        {
          title: "Overview",
          icon: <LayoutDashboard size={18} />,
          href: "/admin/overview",
        },
        {
          title: "Approvals",
          icon: <ShieldCheck size={18} />,
          href: "/admin/approvals",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Users",
          icon: <Users size={18} />,
          href: "/admin/users",
        },
        {
          title: "Cooks",
          icon: <ChefHat size={18} />,
          href: "/admin/cooks",
        },
        {
          title: "Categories",
          icon: <LayoutGrid size={18} />,
          href: "/admin/categories",
        },
      ],
    },
  ],
};

type Props = {
  role: "Admin" | "Cook";
};

export function AppSidebar({ role }: Props) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar className="bg-[#1A3C6B] pt-8 px-3 border-r border-r-[#ffffff1f]">
      {/* HEADER */}
      <SidebarHeader className="bg-[#1A3C6B]">
        <div className="flex items-center gap-3 bg-[#ffffff14] p-3 rounded-xl">
          <div className="w-10 h-10 flex font-semibold items-center justify-center bg-orange-500 rounded-xl text-lg">
            {user?.name[0]}
          </div>

          <div>
            <h2 className="text-sm text-white font-semibold">{user?.name}</h2>
            <p className="text-xs text-[#ffffff80]">{user?.role}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#1A3C6B]">
        {navItems[role].map((group) => (
          <SidebarGroup key={group.title}>
            {group.title !== "Main" && (
              <SidebarGroupLabel className="text-[#ffffff66] text-xs">
                {group.title}
              </SidebarGroupLabel>
            )}

            <SidebarMenu className="space-y-1">
              {group.items.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    className="text-white p-5 hover:bg-[#ffffff1f] hover:text-white data-[active=true]:bg-[#ffffff1f] data-[active=false]:text-white/50 data-[active=true]:text-white active:bg-transparent"
                  >
                    <Link href={link.href} className="flex items-center gap-2">
                      <span>{link.icon}</span>
                      {link.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="bg-[#1A3C6B] border-t border-t-[#ffffff1f]">
        <SidebarMenuItem className="list-none">
          <SidebarMenuButton
            asChild
            className="text-white p-5 hover:bg-[#ffffff1f] hover:text-white active:bg-transparent"
          >
            <Button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex bg-transparent cursor-pointer w-full justify-start gap-1"
            >
              <span className="text-lg">🚪</span>
              {logoutMutation.isPending ? <Spinner /> : "Logout"}
            </Button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
