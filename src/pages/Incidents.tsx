import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateIncidentForm } from "@/components/incidents/CreateIncidentForm";
import { CreateServiceForm } from "@/components/services/CreateServiceForm";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";
import { OrganizationOverview } from "@/components/OrganizationOverview";
import { useIncidentWebSocket } from "@/hooks/useIncidentWebSocket";
import { toast } from "sonner";
import type { Service } from "@/components/ServiceCard";
import { API_FUNCTIONS } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface IncidentUpdate {
  id: string;
  incidentId: string;
  status: string;
  message: string;
  createdAt: string;
}

interface Incident {
  id: string;
  title: string;
  type: "incident" | "maintenance";
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
  updates?: IncidentUpdate[];
}

const Incidents = () => {
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchServices = async () => {
    try {
      const response = await API_FUNCTIONS.getServices();
      if (response.data) {
        setServices(response.data.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          status: service.status,
          lastUpdated: service.updatedAt,
        })));
      }
    } catch (error) {
      toast.error("Failed to fetch services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleIncidentUpdate = (updatedIncident: Incident) => {
    setIncidents((prev) => {
      const index = prev.findIndex((i) => i.id === updatedIncident.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = updatedIncident;
        return updated;
      }
      return [...prev, updatedIncident];
    });
  };

  const handleServiceSubmit = async (serviceData: Omit<Service, "id" | "lastUpdated">) => {
    try {
      if (selectedService) {
        const response = await API_FUNCTIONS.updateService(selectedService.id, {
          name: serviceData.name,
          description: serviceData.description,
          status: serviceData.status,
        });
        if (response.data) {
          setServices(prevServices =>
            prevServices.map(service =>
              service.id === selectedService.id
                ? {
                    ...service,
                    ...serviceData,
                    lastUpdated: new Date().toISOString(),
                  }
                : service
            )
          );
          toast.success("Service updated successfully");
        }
      } else {
        const response = await API_FUNCTIONS.createService({
          name: serviceData.name,
          description: serviceData.description,
        });
        if (response.data) {
          const newService: Service = {
            id: response.data.id,
            ...serviceData,
            lastUpdated: response.data.updatedAt,
          };
          setServices(prev => [...prev, newService]);
          toast.success("Service created successfully");
        }
      }
      setIsServiceDialogOpen(false);
      setSelectedService(undefined);
    } catch (error) {
      toast.error(selectedService ? "Failed to update service" : "Failed to create service");
    }
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsServiceDialogOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await API_FUNCTIONS.deleteService(serviceId);
      setServices(prev => prev.filter(service => service.id !== serviceId));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleAddUpdate = (incidentId: string, update: Omit<IncidentUpdate, "id" | "createdAt">) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === incidentId) {
        const newUpdate: IncidentUpdate = {
          id: crypto.randomUUID(),
          ...update,
          createdAt: new Date().toISOString(),
        };
        return {
          ...incident,
          status: update.status,
          updatedAt: new Date().toISOString(),
          updates: [...(incident.updates || []), newUpdate],
        };
      }
      return incident;
    }));
    toast.success("Update added successfully");
  };

  // Initialize WebSocket connection
  useIncidentWebSocket(handleIncidentUpdate);

  return (
    <div className="container mx-auto px-4 py-8">
      <OrganizationOverview organization={user?.organization} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Incidents & Maintenance</h1>
        <div className="flex gap-2">
          <Dialog open={isServiceDialogOpen} onOpenChange={(open) => {
            setIsServiceDialogOpen(open);
            if (!open) setSelectedService(undefined);
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage Services
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedService ? "Edit" : "Create"} Service</DialogTitle>
              </DialogHeader>
              <CreateServiceForm
                onSubmit={handleServiceSubmit}
                onClose={() => setIsServiceDialogOpen(false)}
                initialData={selectedService}
                onDelete={selectedService ? () => handleDeleteService(selectedService.id) : undefined}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isIncidentDialogOpen} onOpenChange={setIsIncidentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Incident
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Incident</DialogTitle>
              </DialogHeader>
              <CreateIncidentForm
                onSubmit={(incident) => {
                  const newIncident: Incident = {
                    id: crypto.randomUUID(),
                    title: incident.title,
                    type: incident.type,
                    status: incident.status,
                    serviceId: incident.serviceId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    updates: [],
                  };
                  handleIncidentUpdate(newIncident);
                  setIsIncidentDialogOpen(false);
                }}
                onClose={() => setIsIncidentDialogOpen(false)}
                services={services}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <IncidentsTable 
        incidents={incidents} 
        services={services} 
        onUpdateIncident={handleIncidentUpdate}
        onEditService={handleEditService}
        onAddUpdate={handleAddUpdate}
      />
    </div>
  );
};

export default Incidents;