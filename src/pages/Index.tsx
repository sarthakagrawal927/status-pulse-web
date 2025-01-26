import { useState } from "react";
import { ServiceCard, type Service } from "@/components/ServiceCard";
import { StatusOverview } from "@/components/StatusOverview";
import { OrganizationOverview } from "@/components/OrganizationOverview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockServices: Service[] = [
  {
    id: "1",
    name: "API",
    description: "Core API services and endpoints",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Web Dashboard",
    description: "Customer-facing web dashboard",
    status: "degraded",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Database",
    description: "Primary database cluster",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "CDN",
    description: "Content delivery network",
    status: "maintenance",
    lastUpdated: new Date().toISOString(),
  },
];

const mockIncidents = [
  {
    id: "1",
    title: "API Performance Degradation",
    type: "incident",
    status: "investigating",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z",
    serviceId: "1",
    updates: [
      {
        id: "u1",
        status: "investigating",
        message: "We are investigating reports of elevated API response times.",
        createdAt: "2024-01-20T10:00:00Z",
      },
      {
        id: "u2",
        status: "identified",
        message: "The root cause has been identified as increased traffic load.",
        createdAt: "2024-01-20T11:00:00Z",
      }
    ]
  },
  {
    id: "2",
    title: "Scheduled Database Maintenance",
    type: "maintenance",
    status: "scheduled",
    createdAt: "2024-01-25T15:00:00Z",
    updatedAt: "2024-01-25T15:00:00Z",
    serviceId: "3",
    updates: [
      {
        id: "u3",
        status: "scheduled",
        message: "Database maintenance scheduled for performance improvements.",
        createdAt: "2024-01-25T15:00:00Z",
      }
    ]
  }
];

const Index = () => {
  const [services] = useState<Service[]>(mockServices);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating":
        return "bg-yellow-500";
      case "identified":
        return "bg-orange-500";
      case "monitoring":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <OrganizationOverview organization={mockOrganization} />
          <StatusOverview services={services} />
          
          {/* Active Incidents Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Active Incidents</h2>
            <Accordion type="single" collapsible className="w-full">
              {mockIncidents.map((incident) => (
                <AccordionItem key={incident.id} value={incident.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge variant={incident.type === "incident" ? "destructive" : "secondary"}>
                        {incident.type === "incident" ? "Incident" : "Maintenance"}
                      </Badge>
                      <span className="font-medium">{incident.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {incident.updates.map((update) => (
                        <div key={update.id} className="border-l-2 border-primary pl-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("h-2 w-2 rounded-full", getStatusColor(update.status))} />
                            <span className="font-medium capitalize">{update.status}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(update.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                incidents={mockIncidents.filter(i => i.serviceId === service.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;