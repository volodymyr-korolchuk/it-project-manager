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
    <div className="h-screen bg-background text-foreground relative">
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
            <main className="py-8 px-6 flex flex-col overflow-y-auto max-h-[calc(100vh-73px)] clean-scrollbar">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default DashboardLayout;
