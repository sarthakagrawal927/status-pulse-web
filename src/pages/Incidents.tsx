import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateIncidentForm } from "@/components/incidents/CreateIncidentForm";
import { IncidentsTable } from "@/components/incidents/IncidentsTable";
import { OrganizationOverview } from "@/components/OrganizationOverview";
import { useIncidentWebSocket } from "@/hooks/useIncidentWebSocket";

const Incidents = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const services = [
    {
      id: "api-service",
      name: "API Service",
      description: "Main API endpoints",
    },
    {
      id: "db-service",
      name: "Database Service",
      description: "Primary database cluster",
    },
  ];

  const organization = {
    id: "1",
    name: "Example Organization",
    description: "A technology company focused on developer tools",
    website: "https://example.com",
  };

  const handleIncidentUpdate = (newIncident: any) => {
    setIncidents((prev) => {
      const index = prev.findIndex((i) => i.id === newIncident.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newIncident;
        return updated;
      }
      return [...prev, newIncident];
    });
  };

  // Initialize WebSocket connection
  useIncidentWebSocket(handleIncidentUpdate);

  return (
    <div className="container mx-auto px-4 py-8">
      <OrganizationOverview organization={organization} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Incidents & Maintenance</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <IncidentsTable incidents={incidents} services={services} />
    </div>
  );
};

export default Incidents;