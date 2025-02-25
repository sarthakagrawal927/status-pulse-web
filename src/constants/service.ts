export const SERVICE_STATUSES = {
  OPERATIONAL: 'OPERATIONAL',
  DEGRADED_PERFORMANCE: 'DEGRADED_PERFORMANCE',
  PARTIAL_OUTAGE: 'PARTIAL_OUTAGE',
  MAJOR_OUTAGE: 'MAJOR_OUTAGE',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type ServiceStatus = typeof SERVICE_STATUSES[keyof typeof SERVICE_STATUSES];
