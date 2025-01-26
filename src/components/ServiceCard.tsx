import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { Badge } from "./ui/badge";

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
            {activeIncidents.map(incident => (
              <div key={incident.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={incident.type === "incident" ? "destructive" : "secondary"}>
                    {incident.type === "incident" ? "Incident" : "Maintenance"}
                  </Badge>
                  <span className="text-sm font-medium">{incident.title}</span>
                </div>
                {incident.updates && incident.updates.length > 0 && (
                  <div className="border-l-2 border-primary pl-4 space-y-2">
                    {incident.updates.slice(-1).map(update => (
                      <div key={update.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{update.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};