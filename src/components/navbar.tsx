"use client";

import { usePathname } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";
import { TimeTrackingIndicator } from "@/features/tasks/components/time-tracking-indicator";

import { MobileSidebar } from "./mobile-sidebar";

const pathnameMap = {
  "tasks": {
    title: "Tasks",
    description: "View all of your tasks here",
  },
  "projects": {
    title: "My Project",
    description: "View tasks of your project here"
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-medium">
          {/* {title} */}
        </h1>
        <p className="text-muted-foreground">
          {/* {description} */}
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <TimeTrackingIndicator />
        <MobileSidebar />
        <UserButton />
      </div>
    </nav>
  );
};
