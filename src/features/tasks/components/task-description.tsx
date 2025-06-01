import { useState } from "react";
import { PencilIcon, XIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Task } from "../types";
import { useUpdateTask } from "../api/use-update-task";

interface TaskDescriptionProps {
  task: Task;
};

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description || "");
  const [mode, setMode] = useState<"view" | "edit">("view");

  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    mutate({ 
      json: { description: value },
      param: { taskId: task.$id }
    }, {
      onSuccess: () => {
        setMode("view");
      }
    });
  };

  const handleCancel = () => {
    setValue(task.description || "");
    setMode("view");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4 bg-card">
        <CardTitle className="text-xl">Description</CardTitle>
        {mode === "view" ? (
          <Button 
            onClick={() => setMode("edit")} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleCancel} 
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <XIcon className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              variant="default" 
              size="sm"
              className="gap-2"
              disabled={isPending}
            >
              <SaveIcon className="h-4 w-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6 py-4">
        {mode === "edit" ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Add a description for this task..."
              value={value}
              rows={8}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
              className="resize-y min-h-[200px] focus:ring-primary"
            />
            <div className="text-xs text-muted-foreground">
              Tip: You can use markdown to format your description
            </div>
          </div>
        ) : (
          <div className="min-h-[200px] prose prose-sm max-w-none">
            {task.description ? (
              <div className="whitespace-pre-wrap">{task.description}</div>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm py-12">
                No description provided. Click "Edit" to add details about this task.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
