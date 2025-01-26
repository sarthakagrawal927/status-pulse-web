import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  lastUpdated: string;
}

interface Incident {
  id: string;
  title: string;
  type: "incident" | "maintenance";
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
  updates?: {
    id: string;
    status: string;
    message: string;
    createdAt: string;
  }[];
}

interface ServiceCardProps {
  service: Service;
  incidents?: Incident[];
}

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

export const ServiceCard = ({ service, incidents = [] }: ServiceCardProps) => {
  const activeIncidents = incidents.filter(
    incident => incident.serviceId === service.id && incident.status !== "resolved"
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
        <StatusIndicator status={service.status} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{service.description}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date(service.lastUpdated).toLocaleString()}
        </p>
        {activeIncidents.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-semibold">Active Incidents</h4>
            <Accordion type="single" collapsible className="w-full">
              {activeIncidents.map(incident => (
                <AccordionItem key={incident.id} value={incident.id}>
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={incident.type === "incident" ? "destructive" : "secondary"}>
                        {incident.type === "incident" ? "Incident" : "Maintenance"}
                      </Badge>
                      <span className="text-sm font-medium">{incident.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {incident.updates && incident.updates.length > 0 && (
                      <div className="space-y-3">
                        {incident.updates.map(update => (
                          <div key={update.id} className="border-l-2 border-primary pl-4">
                            <div className="flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", getStatusColor(update.status))} />
                              <span className="font-medium capitalize">{update.status}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(update.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{update.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};