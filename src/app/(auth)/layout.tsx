"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return ( 
    <main className="bg-background min-h-screen relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Green floating shape - repositioned closer to center-left */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-40 blur-2xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(16, 185, 129, 0.3) 40%, rgba(16, 185, 129, 0.1) 70%, transparent 100%)',
            top: '20%',
            left: '-20%',
            animation: 'float-green 8s ease-in-out infinite, pulse-green 4s ease-in-out infinite',
          }}
        />
        
        {/* Blue floating shape - repositioned closer to center-right */}
        <div 
          className="absolute w-[550px] h-[550px] rounded-full opacity-45 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
            top: '30%',
            right: '-25%',
            animation: 'float-blue 10s ease-in-out infinite, pulse-blue 6s ease-in-out infinite',
          }}
        />
        
        {/* Additional green shape - behind center area */}
        <div 
          className="absolute w-[450px] h-[450px] rounded-full opacity-35 blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.7) 0%, rgba(16, 185, 129, 0.4) 40%, rgba(16, 185, 129, 0.1) 70%, transparent 100%)',
            top: '10%',
            left: '40%',
            animation: 'float-small 12s ease-in-out infinite, pulse-small 3s ease-in-out infinite',
          }}
        />
        
        {/* Additional blue shape - lower left for balance */}
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-40 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 40%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
            bottom: '10%',
            left: '-15%',
            animation: 'float-blue-2 14s ease-in-out infinite, pulse-blue-2 5s ease-in-out infinite',
          }}
        />

        {/* Extra center green shape - directly behind form area */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-30 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-center 16s ease-in-out infinite, pulse-center 7s ease-in-out infinite',
          }}
        />

        {/* Large blue shape behind form area */}
        <div 
          className="absolute w-[520px] h-[520px] rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)',
            top: '55%',
            left: '45%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-subtle-1 18s ease-in-out infinite, pulse-subtle-1 8s ease-in-out infinite',
          }}
        />

        {/* Subtle green - top right area */}
        <div 
          className="absolute w-[300px] h-[300px] rounded-full opacity-18 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 100%)',
            top: '5%',
            right: '15%',
            animation: 'float-subtle-2 20s ease-in-out infinite, pulse-subtle-2 9s ease-in-out infinite',
          }}
        />

        {/* Subtle blue - bottom center */}
        <div 
          className="absolute w-[280px] h-[280px] rounded-full opacity-22 blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 60%, transparent 100%)',
            bottom: '5%',
            left: '55%',
            animation: 'float-subtle-3 15s ease-in-out infinite, pulse-subtle-3 6s ease-in-out infinite',
          }}
        />

        {/* Subtle green - left area */}
        <div 
          className="absolute w-[320px] h-[320px] rounded-full opacity-16 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.15) 55%, transparent 100%)',
            top: '35%',
            left: '5%',
            animation: 'float-subtle-4 22s ease-in-out infinite, pulse-subtle-4 10s ease-in-out infinite',
          }}
        />

        {/* Very subtle center-right blue */}
        <div 
          className="absolute w-[250px] h-[250px] rounded-full opacity-14 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)',
            top: '15%',
            right: '30%',
            animation: 'float-subtle-5 25s ease-in-out infinite, pulse-subtle-5 11s ease-in-out infinite',
          }}
        />

        {/* Very subtle bottom right green */}
        <div 
          className="absolute w-[380px] h-[380px] rounded-full opacity-12 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.1) 65%, transparent 100%)',
            bottom: '15%',
            right: '10%',
            animation: 'float-subtle-6 19s ease-in-out infinite, pulse-subtle-6 7s ease-in-out infinite',
          }}
        />
      </div>

      {/* Header - positioned absolutely at top */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto w-full max-w-screen-2xl p-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold">IT Project Manager</p>
            </div>

            <Button asChild variant="secondary">
              <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                {isSignIn ? "Sign Up" : "Login"}
              </Link>
            </Button>
          </nav>
        </div>
      </div>
      
      {/* Content - centered in full viewport */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-green {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(40px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 40px) scale(0.95); }
          75% { transform: translate(30px, 20px) scale(1.02); }
        }
        
        @keyframes float-blue {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          30% { transform: translate(-50px, 30px) scale(1.08); }
          60% { transform: translate(40px, -40px) scale(0.92); }
          80% { transform: translate(-30px, -20px) scale(1.03); }
        }
        
        @keyframes float-small {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40% { transform: translate(30px, -50px) scale(1.1); }
          70% { transform: translate(-40px, 30px) scale(0.9); }
        }
        
        @keyframes float-blue-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          35% { transform: translate(50px, 40px) scale(1.06); }
          65% { transform: translate(-30px, -50px) scale(0.94); }
        }

        @keyframes float-center {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          25% { transform: translate(-45%, -55%) scale(1.03); }
          50% { transform: translate(-55%, -45%) scale(0.97); }
          75% { transform: translate(-48%, -52%) scale(1.01); }
        }
        
        @keyframes pulse-green {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.65; }
        }
        
        @keyframes pulse-blue {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.7; }
        }
        
        @keyframes pulse-small {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.6; }
        }
        
        @keyframes pulse-blue-2 {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.65; }
        }

        @keyframes pulse-center {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.55; }
        }

        /* Subtle shape animations */
        @keyframes float-subtle-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(25px, 20px) scale(1.02); }
          66% { transform: translate(-15px, -30px) scale(0.98); }
        }

        @keyframes float-subtle-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40% { transform: translate(-20px, 25px) scale(1.03); }
          80% { transform: translate(30px, -15px) scale(0.97); }
        }

        @keyframes float-subtle-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(35px, -20px) scale(1.04); }
        }

        @keyframes float-subtle-4 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(15px, -25px) scale(1.01); }
          75% { transform: translate(-25px, 20px) scale(0.99); }
        }

        @keyframes float-subtle-5 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          30% { transform: translate(-30px, 15px) scale(1.02); }
          70% { transform: translate(20px, -25px) scale(0.98); }
        }

        @keyframes float-subtle-6 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          45% { transform: translate(-15px, -20px) scale(1.01); }
        }

        @keyframes pulse-subtle-1 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.35; }
        }

        @keyframes pulse-subtle-2 {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.32; }
        }

        @keyframes pulse-subtle-3 {
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.38; }
        }

        @keyframes pulse-subtle-4 {
          0%, 100% { opacity: 0.16; }
          50% { opacity: 0.28; }
        }

        @keyframes pulse-subtle-5 {
          0%, 100% { opacity: 0.14; }
          50% { opacity: 0.25; }
        }

        @keyframes pulse-subtle-6 {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.22; }
        }
      `}</style>
    </main>
   );
};
 
export default AuthLayout;