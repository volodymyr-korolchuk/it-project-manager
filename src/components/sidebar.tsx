import Image from "next/image";
import Link from "next/link";

import { Projects } from "./projects";
import { Navigation } from "./navigation";
import { DottedSeparator } from "./dotted-separator";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-card p-4 w-full flex flex-col relative overflow-hidden">
      {/* Subtle Gradient Blobs for Sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Blue Blob - Top Area */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 40%, rgba(59, 130, 246, 0.015) 70%, transparent 100%)',
            top: '-30%',
            left: '-40%',
            animation: 'float-sidebar-1 20s ease-in-out infinite',
          }}
        />
        
        {/* Subtle Green Blob - Bottom Area */}
        <div 
          className="absolute w-[350px] h-[350px] rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, rgba(16, 185, 129, 0.035) 45%, rgba(16, 185, 129, 0.012) 75%, transparent 100%)',
            bottom: '-25%',
            right: '-35%',
            animation: 'float-sidebar-2 18s ease-in-out infinite',
          }}
        />
      </div>

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
