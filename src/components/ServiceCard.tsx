import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  lastUpdated: string;
}

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
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
      </CardContent>
    </Card>
  );
};