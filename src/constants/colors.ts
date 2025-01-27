import { INCIDENT_STATUSES, IncidentStatus } from "./incident";
import { SERVICE_STATUSES, ServiceStatus } from "./service";

export const INCIDENT_STATUS_COLORS = {
  [INCIDENT_STATUSES.INVESTIGATING]:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  [INCIDENT_STATUSES.IDENTIFIED]:
    "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  [INCIDENT_STATUSES.MONITORING]:
    "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  [INCIDENT_STATUSES.RESOLVED]:
    "bg-green-500/10 text-green-700 dark:text-green-400",
} as const;

export const SERVICE_STATUS_COLORS = {
  [SERVICE_STATUSES.OPERATIONAL]:
    "bg-green-500/10 text-green-700 dark:text-green-400",
  [SERVICE_STATUSES.DEGRADED_PERFORMANCE]:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  [SERVICE_STATUSES.PARTIAL_OUTAGE]:
    "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  [SERVICE_STATUSES.MAJOR_OUTAGE]:
    "bg-red-500/10 text-red-700 dark:text-red-400",
  [SERVICE_STATUSES.MAINTENANCE]:
    "bg-blue-500/10 text-blue-700 dark:text-blue-400",
} as const;

export const getIncidentStatusColor = (status: IncidentStatus) => {
  return (
    INCIDENT_STATUS_COLORS[status] ||
    "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  );
};

export const getServiceStatusColor = (status: ServiceStatus) => {
  return (
    SERVICE_STATUS_COLORS[status] ||
    "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  );
};
