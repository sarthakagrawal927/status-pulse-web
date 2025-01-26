import { useState } from "react";
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
import type { Service } from "@/components/ServiceCard";

const Incidents = () => {
  const [isIncidentDialogOpen, setIsIncidentDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [services, setServices] = useState([
    {
      id: "api-service",
      name: "API Service",
      description: "Main API endpoints",
      status: "operational" as const,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "db-service",
      name: "Database Service",
      description: "Primary database cluster",
      status: "operational" as const,
      lastUpdated: new Date().toISOString(),
    },
  ]);
  
  const [incidents, setIncidents] = useState([
    {
      id: "1",
      title: "API Performance Degradation",
      type: "incident" as const,
      status: "resolved",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T12:00:00Z",
      description: "API response times were elevated due to increased traffic.",
      serviceId: "api-service",
    },
    {
      id: "2",
      title: "Database Maintenance",
      type: "maintenance" as const,
      status: "scheduled",
      createdAt: "2024-01-25T15:00:00Z",
      updatedAt: "2024-01-25T15:00:00Z",
      description: "Scheduled database upgrade to improve performance.",
      serviceId: "db-service",
    },
  ]);

  const organization = {
    id: "1",
    name: "Example Organization",
    description: "A technology company focused on developer tools",
    website: "https://example.com",
  };

  const handleIncidentUpdate = (updatedIncident: any) => {
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

  const handleServiceSubmit = (serviceData: Omit<Service, "id" | "lastUpdated">) => {
    if (selectedService) {
      // Update existing service
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
    } else {
      // Create new service
      const newService: Service = {
        id: crypto.randomUUID(),
        ...serviceData,
        lastUpdated: new Date().toISOString(),
      };
      setServices(prev => [...prev, newService]);
    }
    setIsServiceDialogOpen(false);
    setSelectedService(undefined);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsServiceDialogOpen(true);
  };

  // Initialize WebSocket connection
  useIncidentWebSocket(handleIncidentUpdate);

  return (
    <div className="container mx-auto px-4 py-8">
      <OrganizationOverview organization={organization} />
      
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
                onSubmit={handleIncidentUpdate}
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
      />
    </div>
  );
};

export default Incidents;