import { type ServiceStatus } from "@/constants/service";
import {
  type IncidentStatus,
  type IncidentType,
  type IncidentImpact,
} from "@/constants/incident";

export interface IncidentUpdate {
  id: string;
  message: string;
  status: IncidentStatus;
  createdAt: string;
  incidentId?: string;
  createdById?: string;
}

export interface CreateIncidentData {
  title: string;
  description: string;
  type: IncidentType;
  status: IncidentStatus;
  impact: IncidentImpact;
  serviceId: string;
}

export interface Incident extends CreateIncidentData {
  id: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  updates?: IncidentUpdate[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  organizationId?: string;
  updatedAt: string;
  incidents?: Incident[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  website: string;
}

export interface CreateUpdateData {
  message: string;
  status: IncidentStatus;
}

export type CreateServiceData = {
  name: string;
  description: string;
  status: ServiceStatus;
  organizationId?: string;
};
