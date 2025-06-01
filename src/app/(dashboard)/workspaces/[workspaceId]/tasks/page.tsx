import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Page } from "@/components/page";
import { ScrollArea } from "@/components/ui/scroll-area";

const TasksPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <Page>
      <ScrollArea className="h-full">
        <TaskViewSwitcher />
      </ScrollArea>
    </Page>
  );
};

export default TasksPage;
