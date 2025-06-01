import { useState } from "react";
import { Plus, Trash } from "lucide-react";
import { format } from "date-fns";

import { formatTime } from "@/lib/format-time";
import { useTaskTimeTracking } from "../api/use-task-time-tracking";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimeTrackingButton } from "./time-tracking-button";

interface TimeTrackingSummaryProps {
  taskId: string;
}

export function TimeTrackingSummary({ taskId }: TimeTrackingSummaryProps) {
  const [isAddingTimeEntry, setIsAddingTimeEntry] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  const {
    timeEntries,
    totalTimeTracked,
    addTimeEntry,
    deleteTimeEntry,
    isAddingTimeEntry: isSubmittingTimeEntry,
    isDeletingTimeEntry,
  } = useTaskTimeTracking(taskId);

  const handleAddTimeEntry = () => {
    addTimeEntry({
      startTime,
      endTime,
      description
    }, {
      onSuccess: () => {
        setIsAddingTimeEntry(false);
        setStartTime("");
        setEndTime("");
        setDescription("");
      }
    });
  };

  const handleDeleteTimeEntry = (entryId: string) => {
    if (confirm("Are you sure you want to delete this time entry?")) {
      deleteTimeEntry(entryId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Time Tracking</h3>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsAddingTimeEntry(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Time
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Time Spent</div>
            <div className="text-2xl font-mono font-medium">{formatTime(totalTimeTracked, true)}</div>
          </div>
        </div>

        <ScrollArea className="h-[300px] w-full">
          {timeEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => (
                  <TableRow key={entry.$id}>
                    <TableCell>
                      {format(new Date(entry.startTime), "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(entry.startTime), "h:mm a")} - {format(new Date(entry.endTime), "h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{formatTime(entry.duration)}</TableCell>
                    <TableCell>{entry.userName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.description || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTimeEntry(entry.$id)}
                        disabled={isDeletingTimeEntry}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No time entries yet
            </div>
          )}
        </ScrollArea>
      </div>

      <Dialog open={isAddingTimeEntry} onOpenChange={setIsAddingTimeEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on?"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddingTimeEntry(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTimeEntry}
              disabled={!startTime || !endTime || isSubmittingTimeEntry}
            >
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 