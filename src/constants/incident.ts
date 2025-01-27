export const INCIDENT_TYPES = {
  INCIDENT: "INCIDENT",
  MAINTENANCE: "MAINTENANCE",
} as const;

export const INCIDENT_STATUSES = {
  INVESTIGATING: "INVESTIGATING",
  IDENTIFIED: "IDENTIFIED",
  MONITORING: "MONITORING",
  RESOLVED: "RESOLVED",
} as const;

export const INCIDENT_IMPACTS = {
  MINOR: "MINOR",
  MAJOR: "MAJOR",
  CRITICAL: "CRITICAL",
} as const;

export type IncidentType = (typeof INCIDENT_TYPES)[keyof typeof INCIDENT_TYPES];
export type IncidentStatus =
  (typeof INCIDENT_STATUSES)[keyof typeof INCIDENT_STATUSES];
export type IncidentImpact =
  (typeof INCIDENT_IMPACTS)[keyof typeof INCIDENT_IMPACTS];
