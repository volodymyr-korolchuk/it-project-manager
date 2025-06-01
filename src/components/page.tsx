import { cn } from "@/lib/utils";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Page = ({ children, className, ...props }: PageProps) => {
  return (
    <div className={cn("h-full flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}; 