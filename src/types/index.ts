import { type ServiceStatus } from "@/constants/service";
import {
  type IncidentStatus,
  type IncidentType,
  type IncidentImpact,
} from "@/constants/incident";
import { type ActionType } from "@/constants/action";

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

export type { ActionType } from "@/constants/action";

export interface UserAction {
  id: string;
  actionType: ActionType;
  description: string;
  metadata?: JSON;
  userId: string;
  organizationId: string;
  serviceId?: string;
  incidentId?: string;
  createdAt: string;
}

export interface Maintenance {
  id: string;
  start: string;
  end: string;
  notes?: string;
  service: {
    id: string;
    name: string;
  };
}

export interface MaintenanceFormData {
  start: Date;
  end: Date;
  notes?: string;
}

export interface ServiceWithMaintenance {
  ServiceMaintenance: Maintenance[];
  name: string;
  status: string;
  id: string;
  createdAt: string;
}
