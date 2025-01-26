import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "operational" | "degraded" | "outage" | "maintenance";
  className?: string;
  editable?: boolean;
  onStatusChange?: (status: "operational" | "degraded" | "outage" | "maintenance") => void;
}

const statusConfig = {
  operational: {
    color: "bg-status-operational",
    label: "Operational",
  },
  degraded: {
    color: "bg-status-degraded",
    label: "Degraded Performance",
  },
  outage: {
    color: "bg-status-outage",
    label: "Major Outage",
  },
  maintenance: {
    color: "bg-status-maintenance",
    label: "Maintenance",
  },
};

export const StatusIndicator = ({ status, className, editable, onStatusChange }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "h-3 w-3 rounded-full animate-status-pulse", 
          config.color,
          editable && "cursor-pointer"
        )}
        onClick={() => {
          if (editable && onStatusChange) {
            const statuses: ("operational" | "degraded" | "outage" | "maintenance")[] = ["operational", "degraded", "outage", "maintenance"];
            const currentIndex = statuses.indexOf(status);
            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
            onStatusChange(nextStatus);
          }
        }}
      />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};