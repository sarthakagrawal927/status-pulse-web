import { type Incident, type Service } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_STATUS_COLORS, INCIDENT_STATUS_COLORS } from "@/constants/colors";
import { INCIDENT_STATUSES, type IncidentStatus } from "@/constants/incident";
import { SERVICE_STATUSES, type ServiceStatus } from "@/constants/service";
import { cn } from "@/lib/utils";
import { CreateUpdateForm } from "./CreateUpdateForm";

interface CreateUpdateData {
  message: string;
  status: IncidentStatus;
}

interface Update {
  id: string;
  message: string;
  status: IncidentStatus;
  createdAt: string;
}

interface IncidentsTableProps {
  services: Service[];
  onUpdateIncident: (updatedIncident: Incident) => void;
  onEditService: (service: Service) => void;
  onUpdateService: (serviceId: string, status: ServiceStatus) => void;
  onAddUpdate: (incidentId: string, update: CreateUpdateData) => void;
}

export const IncidentsTable = ({ 
  services, 
  onUpdateIncident, 
  onEditService,
  onUpdateService,
  onAddUpdate,
}: IncidentsTableProps) => {
  const getStatusColor = (status: IncidentStatus) => {
    return INCIDENT_STATUS_COLORS[status] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatStatus = (status: string) => {
    if (!status) return "N/A";
    return status.split("_").map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  return (
    <div className="space-y-6">
      {services.map((service) => {
        const serviceIncidents = service.incidents || [];
        return (
          <div key={service.id} className="rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{service.name}</h2>
                <Select
                  value={service.status}
                  onValueChange={(value: ServiceStatus) => onUpdateService(service.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue>
                      <Badge className={cn("rounded-md px-2 py-1", SERVICE_STATUS_COLORS[service.status])}>
                        {formatStatus(service.status)}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_STATUSES).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        <Badge className={cn("rounded-md px-2 py-1", SERVICE_STATUS_COLORS[value])}>
                          {formatStatus(key)}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => onEditService(service)}>
                Edit Service
              </Button>
            </div>

            {serviceIncidents.length > 0 ? (
              <div className="space-y-4">
                {serviceIncidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{incident.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                        <div className="flex gap-2 items-center">
                          <Badge variant={incident.impact === 'MAJOR' ? "destructive" : "secondary"}>
                            {formatStatus(incident.impact)}
                          </Badge>
                          <Select
                            value={incident.status}
                            onValueChange={(value: IncidentStatus) =>
                              onUpdateIncident({ ...incident, status: value })
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue>
                                <Badge className={cn("rounded-md px-2 py-1", getStatusColor(incident.status))}>
                                  {formatStatus(incident.status)}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(INCIDENT_STATUSES).map(([key, value]) => (
                                <SelectItem key={value} value={value}>
                                  <Badge className={cn("rounded-md px-2 py-1", getStatusColor(value))}>
                                    {formatStatus(key)}
                                  </Badge>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Add Update
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Update to {incident.title}</DialogTitle>
                          </DialogHeader>
                          <CreateUpdateForm
                            onSubmit={(update) => onAddUpdate(incident.id, update)}
                            currentStatus={incident.status}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>

                    {incident.updates && incident.updates.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-semibold">Updates</h4>
                        <div className="space-y-2">
                          {incident.updates.map((update: Update) => (
                            <div key={update.id} className="flex items-start gap-2 text-sm bg-muted/50 p-2 rounded">
                              <Badge className={cn("rounded-md px-2 py-1 shrink-0", getStatusColor(update.status))}>
                                {formatStatus(update.status)}
                              </Badge>
                              <p className="flex-grow">{update.message}</p>
                              <span className="text-muted-foreground text-xs whitespace-nowrap">
                                {formatDate(update.createdAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No incidents reported
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};