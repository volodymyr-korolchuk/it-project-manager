import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { DocumentsClient } from "./client";

const ProjectDocumentsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <DocumentsClient />
};

export default ProjectDocumentsPage; 