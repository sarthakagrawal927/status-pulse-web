import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Service } from "@/types";
import { cn } from "@/lib/utils";
import { SERVICE_STATUSES } from "@/constants/service";

interface StatusOverviewProps {
  services: Service[];
}

export const StatusOverview = ({ services }: StatusOverviewProps) => {
  const totalServices = services.length;
  const operationalServices = services.filter(
    (service) => service.status === SERVICE_STATUSES.OPERATIONAL
  ).length;

  const getSystemStatus = () => {
    if (operationalServices === totalServices) return "All Systems Operational";
    if (operationalServices === 0) return "Major System Outage";
    return "Partial System Outage";
  };

  const getStatusColor = () => {
    if (operationalServices === totalServices) return "text-status-operational";
    if (operationalServices === 0) return "text-status-outage";
    return "text-status-degraded";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-2xl font-bold text-center", getStatusColor())}>
          {getSystemStatus()}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          {operationalServices} out of {totalServices} services are operational
        </p>
      </CardContent>
    </Card>
  );
};