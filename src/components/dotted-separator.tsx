import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
  className?: string;
  color?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
};

export const DottedSeparator = ({
  className,
  direction = "horizontal"
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div className={cn(
      isHorizontal ? "w-full flex items-center" : "h-full flex flex-col items-center",
      className,
    )}>
      <div
        className={cn(
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          isHorizontal 
            ? "w-full h-px" 
            : "h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
        )}
      />
    </div>
  );
};
