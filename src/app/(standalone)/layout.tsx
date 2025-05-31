import Image from "next/image";
import Link from "next/link";

import { UserButton } from "@/features/auth/components/user-button";

interface StandaloneLayoutProps {
  children: React.ReactNode;
};

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return ( 
    <main className="bg-background min-h-screen relative overflow-hidden">
      {/* Subtle Gradient Background Blobs - Consistent with Dashboard */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Blue Blob - Top Right */}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0.03) 35%, rgba(59, 130, 246, 0.015) 65%, transparent 100%)',
            top: '-25%',
            right: '-40%',
            animation: 'float-dashboard-2 28s ease-in-out infinite',
          }}
        />
        
        {/* Large Green Blob - Bottom Left */}
        <div 
          className="absolute w-[1200px] h-[1200px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.025) 40%, rgba(16, 185, 129, 0.01) 70%, transparent 100%)',
            bottom: '-35%',
            left: '-45%',
            animation: 'float-dashboard-4 32s ease-in-out infinite',
          }}
        />
        
        {/* Center Purple Blob - Very Subtle */}
        <div 
          className="absolute w-[1400px] h-[1400px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, rgba(139, 92, 246, 0.015) 50%, rgba(139, 92, 246, 0.005) 80%, transparent 100%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-dashboard-1 36s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="mx-auto max-w-screen-2xl p-4 relative z-10">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/">
            <p className="text-2xl font-medium">Nexora</p>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
 
export default StandaloneLayout;