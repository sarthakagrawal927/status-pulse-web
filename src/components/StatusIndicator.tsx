import { SERVICE_STATUSES, type ServiceStatus } from "@/constants/service";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: ServiceStatus;
  className?: string;
  editable?: boolean;
  onStatusChange?: (status: ServiceStatus) => void;
}

const statusConfig = {
  [SERVICE_STATUSES.OPERATIONAL]: {
    color: "bg-green-500",
    label: "All systems operational",
  },
  [SERVICE_STATUSES.DEGRADED_PERFORMANCE]: {
    color: "bg-yellow-500",
    label: "Degraded performance",
  },
  [SERVICE_STATUSES.PARTIAL_OUTAGE]: {
    color: "bg-orange-500",
    label: "Partial outage",
  },
  [SERVICE_STATUSES.MAJOR_OUTAGE]: {
    color: "bg-red-500",
    label: "Major outage",
  },
  [SERVICE_STATUSES.MAINTENANCE]: {
    color: "bg-blue-500",
    label: "Under maintenance",
  },
} as const;

export const StatusIndicator = ({ status, className, editable, onStatusChange }: StatusIndicatorProps) => {
  // Ensure status is valid, default to operational if not
  const validStatus = status in statusConfig ? status : SERVICE_STATUSES.OPERATIONAL;
  const config = statusConfig[validStatus];
  
  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-default",
        editable && "cursor-pointer",
        className
      )}
      onClick={() => {
        if (editable && onStatusChange) {
          const statuses = Object.values(SERVICE_STATUSES);
          const currentIndex = statuses.indexOf(validStatus);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          onStatusChange(nextStatus);
        }
      }}
    >
      <div className={cn("h-2 w-2 rounded-full", config.color)} />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};