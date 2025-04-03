import Image from "next/image";
import Link from "next/link";

import { Projects } from "./projects";
import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-card p-4 w-full">
      <Link href="/">
        <p className="text-2xl font-medium">Nexora</p>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
