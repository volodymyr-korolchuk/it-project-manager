"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiHome, 
  HiOutlineHome,
  HiClipboardList,
  HiOutlineClipboardList,
  HiCog,
  HiOutlineCog,
  HiUsers,
  HiOutlineUsers,
  HiChat,
  HiOutlineChat
} from "react-icons/hi";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "",
    icon: HiOutlineHome,
    activeIcon: HiHome,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: HiOutlineClipboardList,
    activeIcon: HiClipboardList,
  },
  {
    label: "Chat",
    href: "/chat",
    icon: HiOutlineChat,
    activeIcon: HiChat,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: HiOutlineCog,
    activeIcon: HiCog,
  },
  {
    label: "Members",
    href: "/members",
    icon: HiOutlineUsers,
    activeIcon: HiUsers,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;
        
        return (
          <Link key={item.href} href={fullHref}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-muted-foreground",
              isActive && "bg-accent/40 border border-border/40 hover:opacity-100 text-foreground"
            )}>
              <Icon className={cn("size-5", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.label}
            </div>
          </Link>
        )
      })}
    </ul>
  );
};
