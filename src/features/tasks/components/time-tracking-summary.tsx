import { useState } from "react";
import { Plus, Trash, Clock, Calendar, User, AlignLeft } from "lucide-react";
import { format } from "date-fns";

import { formatTime } from "@/lib/format-time";
import { useTaskTimeTracking } from "../api/use-task-time-tracking";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TimeTrackingButton } from "./time-tracking-button";

interface TimeEntry {
  $id: string;
  startTime: string;
  endTime: string;
  duration: number;
  userName: string;
  description?: string;
}

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
    <div className="space-y-6">
      {/* Time summary card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4 bg-card">
          <CardTitle className="text-xl">Time Summary</CardTitle>
          <Button 
            onClick={() => setIsAddingTimeEntry(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Time
          </Button>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border-subtle">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Time</div>
                <div className="text-2xl font-mono font-medium">{formatTime(totalTimeTracked, true)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border-subtle">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Entries</div>
                <div className="text-2xl font-medium">{timeEntries.length}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 border-subtle">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Contributors</div>
                <div className="text-2xl font-medium">
                  {new Set(timeEntries.map((entry: TimeEntry) => entry.userName)).size}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Time entries table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4 bg-card">
          <CardTitle className="text-xl">Time Entries</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <ScrollArea className="h-[400px] w-full">
            {timeEntries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map((entry: TimeEntry) => (
                    <TableRow key={entry.$id}>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{format(new Date(entry.startTime), "MMM d, yyyy")}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(entry.startTime), "h:mm a")} - {format(new Date(entry.endTime), "h:mm a")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{formatTime(entry.duration)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <AlignLeft className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{entry.description || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTimeEntry(entry.$id)}
                          disabled={isDeletingTimeEntry}
                        >
                          <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center space-y-2">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground/50" />
                  <p>No time entries yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAddingTimeEntry(true)}
                  >
                    Add your first time entry
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

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