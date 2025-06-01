import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { 
  Databases, 
  Models 
} from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID, TASKS_ID, TIME_ENTRIES_ID } from "@/config";
import { Task } from "../types";

const app = new Hono()
  // Start time tracking for a task
  .post(
    "/:taskId/start",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();

      // Get the task
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      // Check if user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check if task is already being tracked by this user
      if (task.isTracking && task.activeTrackingUserId === user.$id) {
        return c.json({ error: "Task is already being tracked by you" }, 400);
      }

      // Check if any other task is currently being tracked by this user
      const activeTasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("isTracking", true),
          Query.equal("activeTrackingUserId", user.$id)
        ]
      );

      // Stop tracking other tasks if any
      if (activeTasks.total > 0) {
        for (const activeTask of activeTasks.documents) {
          await stopTracking(databases, activeTask.$id, user);
        }
      }

      // Start tracking current task
      const now = new Date();
      await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          isTracking: true,
          lastTrackingStart: now,
          activeTrackingUserId: user.$id
        }
      );

      return c.json({ 
        data: { 
          taskId,
          startedAt: now
        } 
      });
    }
  )
  // Stop time tracking for a task
  .post(
    "/:taskId/stop",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();

      const result = await stopTracking(databases, taskId, user);
      
      if (result.error) {
        return c.json({ error: result.error }, result.status || 400);
      }

      return c.json({ data: result.data });
    }
  )
  // Get time entries for a task
  .get(
    "/:taskId/time-entries",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();

      // Get the task
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      // Check if user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get time entries for this task
      const timeEntries = await databases.listDocuments(
        DATABASE_ID,
        TIME_ENTRIES_ID,
        [
          Query.equal("taskId", taskId),
          Query.orderDesc("startTime")
        ]
      );

      return c.json({ data: timeEntries });
    }
  )
  // Add manual time entry
  .post(
    "/:taskId/time-entries",
    sessionMiddleware,
    zValidator("json", z.object({
      startTime: z.string(),
      endTime: z.string(),
      description: z.string().optional(),
    })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();
      const { startTime, endTime, description } = c.req.valid("json");

      // Get the task
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      // Check if user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      // Validate dates
      if (startDate >= endDate) {
        return c.json({ error: "Start time must be before end time" }, 400);
      }

      const duration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000); // in seconds

      // Create time entry
      const { users } = await createAdminClient();
      const userData = await users.get(user.$id);

      const timeEntry = await databases.createDocument(
        DATABASE_ID,
        TIME_ENTRIES_ID,
        ID.unique(),
        {
          taskId,
          userId: user.$id,
          userName: userData.name || userData.email,
          startTime: startDate,
          endTime: endDate,
          duration,
          description: description || "",
        }
      );

      // Update total time tracked on task
      await updateTaskTimeTracked(databases, taskId);

      return c.json({ data: timeEntry });
    }
  )
  // Delete time entry
  .delete(
    "/time-entries/:entryId",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { entryId } = c.req.param();

      // Get the time entry
      const timeEntry = await databases.getDocument(
        DATABASE_ID,
        TIME_ENTRIES_ID,
        entryId,
      );

      // Check if the entry belongs to the user
      if (timeEntry.userId !== user.$id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get the task to check workspace membership
      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        timeEntry.taskId,
      );

      // Check if user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Delete the time entry
      await databases.deleteDocument(
        DATABASE_ID,
        TIME_ENTRIES_ID,
        entryId,
      );

      // Update total time tracked on task
      await updateTaskTimeTracked(databases, timeEntry.taskId);

      return c.json({ data: { $id: timeEntry.$id } });
    }
  );

// Helper function to stop tracking a task
async function stopTracking(
  databases: Databases,
  taskId: string,
  user: Models.User<Models.Preferences>
): Promise<{ error?: string; status?: number; data?: any }> {
  try {
    // Get the task
    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    // Check if task is being tracked by this user
    if (!task.isTracking || task.activeTrackingUserId !== user.$id) {
      return { 
        error: "Task is not being tracked by you",
        status: 400
      };
    }

    // Check if user is a member of the workspace
    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return {
        error: "Unauthorized",
        status: 401
      };
    }

    const now = new Date();
    const startTime = new Date(task.lastTrackingStart);
    
    // Calculate duration in seconds
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    
    if (duration <= 0) {
      // Just stop tracking without creating an entry if duration is 0 or negative
      await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          isTracking: false,
          activeTrackingUserId: null,
          lastTrackingStart: null
        }
      );
      return { 
        data: { 
          taskId,
          stoppedAt: now,
          duration: 0
        } 
      };
    }

    // Create time entry
    const { users } = await createAdminClient();
    const userData = await users.get(user.$id);

    const timeEntry = await databases.createDocument(
      DATABASE_ID,
      TIME_ENTRIES_ID,
      ID.unique(),
      {
        taskId,
        userId: user.$id,
        userName: userData.name || userData.email,
        startTime: startTime,
        endTime: now,
        duration,
        description: "",
      }
    );

    // Update task tracking status
    await databases.updateDocument(
      DATABASE_ID,
      TASKS_ID,
      taskId,
      {
        isTracking: false,
        activeTrackingUserId: null,
        lastTrackingStart: null
      }
    );

    // Update total time tracked on task
    await updateTaskTimeTracked(databases, taskId);

    return { 
      data: { 
        taskId,
        stoppedAt: now,
        duration,
        timeEntry
      } 
    };
  } catch (error) {
    console.error("Error stopping time tracking:", error);
    return { 
      error: "Failed to stop time tracking",
      status: 500
    };
  }
}

// Helper function to update the total time tracked on a task
async function updateTaskTimeTracked(
  databases: Databases,
  taskId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    // Get all time entries for this task
    const timeEntries = await databases.listDocuments(
      DATABASE_ID,
      TIME_ENTRIES_ID,
      [Query.equal("taskId", taskId)]
    );

    // Calculate total duration
    let totalDuration = 0;
    for (const entry of timeEntries.documents) {
      totalDuration += entry.duration || 0;
    }

    // Update task with total time tracked
    await databases.updateDocument(
      DATABASE_ID,
      TASKS_ID,
      taskId,
      { timeTracked: totalDuration }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating task time tracked:", error);
    return { success: false, error };
  }
}

export default app; 