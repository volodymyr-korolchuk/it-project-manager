import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { AnalyticsClient } from "./client";

const ProjectAnalyticsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <AnalyticsClient />
};

export default ProjectAnalyticsPage; 