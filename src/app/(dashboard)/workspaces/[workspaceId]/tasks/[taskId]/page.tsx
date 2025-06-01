import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { ScrollArea } from "@/components/ui/scroll-area";

import { TaskIdClient } from "./client";

const TaskIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-[calc(100vh-73px)] py-6">
      <div className="container h-full px-6">
        <TaskIdClient />
      </div>
    </div>
  );
};

export default TaskIdPage;
