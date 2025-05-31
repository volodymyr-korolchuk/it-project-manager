import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
};

export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-400" : "text-red-400";
  const increaseValueColor = variant === "up" ? "text-emerald-400" : "text-red-400";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown; 

  return (
    <div className="relative p-6 border border-border/30 rounded-xl bg-background/50 hover:bg-background/70 transition-colors duration-200">
      <div className="space-y-3">
        {/* Header with title and change indicator */}
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-muted-foreground leading-none">
            {title}
          </h3>
          
          {/* Simple change indicator */}
          <div className="flex items-center gap-1 text-xs">
            <Icon className={cn(iconColor, "size-3")} />
            <span className={increaseValueColor}>
              {increaseValue > 0 ? "+" : ""}{increaseValue}
            </span>
          </div>
        </div>
        
        {/* Main value */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {value.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
