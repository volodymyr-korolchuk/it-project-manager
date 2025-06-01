import Image from "next/image";
import Link from "next/link";

import { Projects } from "./projects";
import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-card p-4 w-full flex flex-col relative">
      <div className="relative z-10">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Nexora</span>
          </div>
        </Link>
        <DottedSeparator className="my-4" />
        <WorkspaceSwitcher />
        <DottedSeparator className="my-4" />
        <Navigation />
        <DottedSeparator className="my-4" />
        <div className="flex-1 overflow-hidden">
          <Projects />
        </div>
      </div>
    </aside>
  );
};
