"use client";

import React from 'react';
import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

import { TaskStatusChart } from "./charts/task-status-chart";
import { TaskTrendChart } from "./charts/task-trend-chart";
import { PerformanceMetricsChart } from "./charts/performance-metrics-chart";
import { AssigneeWorkloadChart } from "./charts/assignee-workload-chart";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const ProjectAnalyticsDashboard = ({ data }: ProjectAnalyticsResponseType) => {
  const getPerformanceStatus = (rate: number) => {
    if (rate >= 80) return { label: "Excellent", color: "bg-emerald-500", textColor: "text-emerald-700" };
    if (rate >= 60) return { label: "Good", color: "bg-blue-500", textColor: "text-blue-700" };
    if (rate >= 40) return { label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-700" };
    return { label: "Needs Improvement", color: "bg-red-500", textColor: "text-red-700" };
  };

  const performanceStatus = getPerformanceStatus(data.completionRate);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-medium">Project Analytics</h1>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {data.taskDifference > 0 ? '+' : ''}{data.taskDifference} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completionRate}%</div>
            <Badge 
              variant="secondary" 
              className={`${performanceStatus.color} text-white text-xs`}
            >
              {performanceStatus.label}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Avg. Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageDaysToComplete}</div>
            <p className="text-xs text-muted-foreground">days to complete</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overdueTaskCount}</div>
            <p className="text-xs text-muted-foreground">
              {data.overdueTaskDifference > 0 ? '+' : ''}{data.overdueTaskDifference} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traditional Analytics Cards */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Monthly Overview
          </CardTitle>
          <CardDescription>
            Quick comparison with previous month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <AnalyticsCard
              title="Total tasks"
              value={data.taskCount}
              variant={data.taskDifference > 0 ? "up" : "down"}
              increaseValue={data.taskDifference}
            />
            <AnalyticsCard
              title="Assigned Tasks"
              value={data.assignedTaskCount}
              variant={data.assignedTaskDifference > 0 ? "up" : "down"}
              increaseValue={data.assignedTaskDifference}
            />
            <AnalyticsCard
              title="Completed Tasks"
              value={data.completedTaskCount}
              variant={data.completedTaskDifference > 0 ? "up" : "down"}
              increaseValue={data.completedTaskDifference}
            />
            <AnalyticsCard
              title="Incomplete Tasks"
              value={data.incompleteTaskCount}
              variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
              increaseValue={data.incompleteTaskDifference}
            />
            <AnalyticsCard
              title="Overdue Tasks"
              value={data.overdueTaskCount}
              variant={data.overdueTaskDifference > 0 ? "up" : "down"}
              increaseValue={data.overdueTaskDifference}
            />
          </div>
        </CardContent>
      </Card>

      <DottedSeparator />

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Workload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>
                  Current breakdown of tasks by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskStatusChart data={data.statusDistribution} />
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators for the project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetricsChart
                  completionRate={data.completionRate}
                  averageDaysToComplete={data.averageDaysToComplete}
                  totalTasks={data.totalTasks}
                  overdueCount={data.overdueTaskCount}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Task Creation & Completion Trends</CardTitle>
              <CardDescription>
                6-month overview of task creation and completion patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskTrendChart data={data.taskCreationTrend} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Detailed Performance Analysis</CardTitle>
                <CardDescription>
                  Comprehensive view of project health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetricsChart
                  completionRate={data.completionRate}
                  averageDaysToComplete={data.averageDaysToComplete}
                  totalTasks={data.totalTasks}
                  overdueCount={data.overdueTaskCount}
                />
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Data-driven recommendations for improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {data.completionRate >= 80 && (
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-emerald-800 dark:text-emerald-300">
                          Excellent Performance
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-400">
                          Your team is maintaining a high completion rate. Keep up the great work!
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {data.overdueTaskCount > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-300">
                          Overdue Tasks Detected
                        </div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-400">
                          Consider reviewing task priorities and deadlines to improve delivery times.
                        </div>
                      </div>
                    </div>
                  )}

                  {data.averageDaysToComplete > 10 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-blue-800 dark:text-blue-300">
                          Long Completion Times
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-400">
                          Tasks are taking longer than expected. Consider breaking down complex tasks.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Team Workload Distribution</CardTitle>
              <CardDescription>
                Task assignment across team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssigneeWorkloadChart 
                data={data.assigneeDistribution}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 