import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return ( 
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Gradient Background Blobs - Much Bigger and Barely Visible */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Blue Blob - Top Left Area */}
        <div 
          className="absolute w-[1200px] h-[1200px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 30%, rgba(59, 130, 246, 0.02) 60%, transparent 100%)',
            top: '-30%',
            left: '-40%',
            animation: 'float-dashboard-1 25s ease-in-out infinite',
          }}
        />
        
        {/* Large Green Blob - Top Right Area */}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, rgba(16, 185, 129, 0.035) 35%, rgba(16, 185, 129, 0.015) 65%, transparent 100%)',
            top: '-20%',
            right: '-35%',
            animation: 'float-dashboard-2 30s ease-in-out infinite',
          }}
        />
        
        {/* Large Blue Blob - Bottom Right Area */}
        <div 
          className="absolute w-[1400px] h-[1400px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(59, 130, 246, 0.03) 40%, rgba(59, 130, 246, 0.01) 70%, transparent 100%)',
            bottom: '-40%',
            right: '-50%',
            animation: 'float-dashboard-3 35s ease-in-out infinite',
          }}
        />
        
        {/* Large Green Blob - Bottom Left Area */}
        <div 
          className="absolute w-[1100px] h-[1100px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.025) 45%, rgba(16, 185, 129, 0.01) 75%, transparent 100%)',
            bottom: '-25%',
            left: '-45%',
            animation: 'float-dashboard-4 28s ease-in-out infinite',
          }}
        />
        
        {/* Extra Large Center Blob - Very Subtle */}
        <div 
          className="absolute w-[1600px] h-[1600px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.04) 0%, rgba(139, 92, 246, 0.02) 50%, rgba(139, 92, 246, 0.008) 80%, transparent 100%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'float-dashboard-1 40s ease-in-out infinite reverse',
          }}
        />
      </div>

      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="flex w-full h-full relative z-10">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[320px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[320px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DashboardLayout;
