import { CreateIncidentForm } from "@/components/incidents/CreateIncidentForm";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";
import { CreateServiceForm } from "@/components/services/CreateServiceForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { INCIDENT_STATUSES } from "@/constants/incident";
import { type ServiceStatus } from "@/constants/service";
import { API_FUNCTIONS } from "@/lib/api";
import { type CreateIncidentData, type CreateUpdateData, type Incident, type Service } from "@/types";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function IncidentsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await API_FUNCTIONS.getServices();
      if (response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const updateServiceInState = (
    serviceId: string,
    updateFn: (service: Service) => Service
  ) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? updateFn(service) : service
      )
    );
  };

  const handleUpdateIncident = async (updatedIncident: Incident) => {
    try {
      const response = await API_FUNCTIONS.updateIncident(updatedIncident.id, {
        title: updatedIncident.title,
        type: updatedIncident.type,
        status: updatedIncident.status,
        impact: updatedIncident.impact,
        description: updatedIncident.description,
        serviceId: updatedIncident.serviceId,
      });

      if (response.data) {
        updateServiceInState(updatedIncident.serviceId, (service) => ({
          ...service,
          incidents: service.incidents?.map((incident) =>
            incident.id === updatedIncident.id ? updatedIncident : incident
          ) || [],
        }));
        toast.success("Incident updated successfully");
      }
    } catch (error) {
      console.error("Error updating incident:", error);
      toast.error("Failed to update incident");
    }
  };

  const handleCreateIncident = async (data: CreateIncidentData) => {
    try {
      const response = await API_FUNCTIONS.createIncident(data);
      if (response.data) {
        updateServiceInState(data.serviceId, (service) => ({
          ...service,
          incidents: [...(service.incidents || []), response.data],
        }));
        setIsIncidentDialogOpen(false);
        toast.success("Incident created successfully");
      }
    } catch (error) {
      console.error("Error creating incident:", error);
      toast.error("Failed to create incident");
    }
  };

  const handleUpdateService = async (serviceId: string, status: ServiceStatus) => {
    try {
      const response = await API_FUNCTIONS.updateService(serviceId, { status });
      if (response.data) {
        updateServiceInState(serviceId, service => ({
          ...service,
          status,
          updatedAt: new Date().toISOString(),
        }));
        toast.success("Service status updated successfully");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    }
  };

  const handleServiceSubmit = async (serviceData: Omit<Service, "id" | "updatedAt" | "incidents">) => {
    try {
      if (selectedService) {
        const response = await API_FUNCTIONS.updateService(selectedService.id, serviceData);
        if (response.data) {
          updateServiceInState(selectedService.id, service => ({
            ...service,
            ...serviceData,
            updatedAt: new Date().toISOString(),
          }));
          toast.success("Service updated successfully");
        }
      } else {
        const response = await API_FUNCTIONS.createService(serviceData);
        if (response.data) {
          const newService: Service = {
            id: response.data.id,
            ...serviceData,
            updatedAt: response.data.updatedAt,
            incidents: [],
          };
          setServices(prev => [...prev, newService]);
          toast.success("Service created successfully");
        }
      }
      setIsCreateServiceOpen(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Error submitting service:", error);
      toast.error("Failed to submit service");
    }
  };

  const handleAddUpdate = async (incidentId: string, update: CreateUpdateData) => {
    try {
      const response = await API_FUNCTIONS.createIncidentUpdate(incidentId, update);
      if (response.data) {
        setServices(prev =>
          prev.map(service => ({
            ...service,
            incidents: service.incidents?.map(incident =>
              incident.id === incidentId
                ? {
                    ...incident,
                    status: update.status,
                    updatedAt: new Date().toISOString(),
                    updates: [response.data, ...(incident.updates || [])],
                  }
                : incident
            ),
          }))
        );
        toast.success("Update added successfully");
      }
    } catch (error) {
      console.error("Error adding update:", error);
      toast.error("Failed to add update");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  const totalIncidents = services.reduce(
    (acc, service) => acc + (service.incidents?.length || 0),
    0
  );

  const activeIncidents = services.reduce(
    (acc, service) =>
      acc +
      (service.incidents?.filter(
        (incident) => incident.status !== INCIDENT_STATUSES.RESOLVED
      ).length || 0),
    0
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Incidents</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{services.length} Services</span>
            <span>•</span>
            <span>{activeIncidents} Active Incidents</span>
            <span>•</span>
            <span>{totalIncidents} Total Incidents</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateServiceOpen} onOpenChange={setIsCreateServiceOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedService(null)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedService ? "Edit Service" : "Create Service"}
                </DialogTitle>
              </DialogHeader>
              <CreateServiceForm
                onSubmit={handleServiceSubmit}
                onClose={() => {
                  setIsCreateServiceOpen(false);
                  setSelectedService(null);
                }}
                service={selectedService}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isIncidentDialogOpen} onOpenChange={setIsIncidentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <PlusCircle className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
              </DialogHeader>
              <CreateIncidentForm
                onSubmit={handleCreateIncident}
                onClose={() => setIsIncidentDialogOpen(false)}
                services={services}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <IncidentsTable
        services={services}
        onUpdateIncident={handleUpdateIncident}
        onEditService={(service) => {
          setSelectedService(service);
          setIsCreateServiceOpen(true);
        }}
        onUpdateService={handleUpdateService}
        onAddUpdate={handleAddUpdate}
      />
    </div>
  );
}