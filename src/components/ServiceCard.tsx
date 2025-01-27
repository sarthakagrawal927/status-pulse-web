import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { INCIDENT_STATUSES, INCIDENT_TYPES } from "@/constants/incident";
import { getIncidentStatusColor, getServiceStatusColor } from "@/constants/colors";
import { type Service } from "@/types";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const activeIncidents = service.incidents?.filter(
    incident => incident.status !== INCIDENT_STATUSES.RESOLVED
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date(service.updatedAt).toLocaleString()}
        </p>
        {activeIncidents.length > 0 && (
          <div className="mt-4 space-y-3">
            <Accordion type="single" collapsible>
              {activeIncidents.map(incident => (
                <AccordionItem key={incident.id} value={incident.id}>
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex items-center gap-2">
                      {/* <Badge variant={incident.type === INCIDENT_TYPES.INCIDENT ? "destructive" : "secondary"}>
                        {incident.type === INCIDENT_TYPES.INCIDENT ? "Incident" : "Maintenance"}
                      </Badge> */}
                      <span className="text-sm font-medium">{incident.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {incident.updates && incident.updates.length > 0 && (
                      <div className="space-y-2">
                        {incident.updates.map(update => (
                          <div key={update.id} className="border-l-2 border-primary pl-4">
                            <div className="flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", getIncidentStatusColor(update.status))} />
                              <span className="font-medium capitalize">{update.status.toLowerCase()}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(update.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm">{update.message}</p>
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