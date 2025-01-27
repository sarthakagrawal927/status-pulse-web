import { OrganizationOverview } from "@/components/OrganizationOverview";
import { ServiceCard } from "@/components/ServiceCard";
import { StatusOverview } from "@/components/StatusOverview";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { INCIDENT_STATUSES, type IncidentImpact } from "@/constants/incident";
import { API_FUNCTIONS } from "@/lib/api";
import { type Service } from "@/types";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case INCIDENT_STATUSES.INVESTIGATING:
        return "bg-yellow-500";
      case INCIDENT_STATUSES.IDENTIFIED:
        return "bg-orange-500";
      case INCIDENT_STATUSES.MONITORING:
        return "bg-blue-500";
      case INCIDENT_STATUSES.RESOLVED:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getImpactBadge = (impact: IncidentImpact) => {
    switch (impact) {
      case "CRITICAL":
        return <Badge variant="destructive" className="font-semibold">Critical</Badge>;
      case "MAJOR":
        return <Badge variant="destructive" className="bg-orange-500">Major</Badge>;
      case "MINOR":
        return <Badge variant="secondary" className="bg-yellow-500 text-black">Minor</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case INCIDENT_STATUSES.INVESTIGATING:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case INCIDENT_STATUSES.IDENTIFIED:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case INCIDENT_STATUSES.MONITORING:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case INCIDENT_STATUSES.RESOLVED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeIncidents = services
    .flatMap(service => service.incidents || [])
    .filter(incident => incident.status !== INCIDENT_STATUSES.RESOLVED)
    .sort((a, b) => {
      // Sort by impact first
      const impactOrder = { CRITICAL: 0, MAJOR: 1, MINOR: 2, NONE: 3 };
      const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
      if (impactDiff !== 0) return impactDiff;
      // Then by most recent
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <OrganizationOverview  services={services} />
          <StatusOverview services={services} />
          
          {/* Active Incidents Section */}
          {activeIncidents.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Active Incidents</h2>
                <Badge variant="outline" className="text-sm">
                  {activeIncidents.length} Active
                </Badge>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {activeIncidents.map((incident) => (
                  <AccordionItem key={incident.id} value={incident.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        {/* <Badge variant={incident.type === INCIDENT_TYPES.INCIDENT ? "destructive" : "secondary"}>
                          {incident.type === INCIDENT_TYPES.INCIDENT ? "Incident" : "Maintenance"}
                        </Badge> */}
                        {getImpactBadge(incident.impact)}
                        <span className="font-medium">{incident.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Started: {new Date(incident.createdAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Service: {services.find(s => s.id === incident.serviceId)?.name}</span>
                        </div>
                        {incident.updates?.map((update) => (
                          <div key={update.id} className="border-l-2 border-primary pl-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(update.status)}
                              <span className="font-medium capitalize">{update.status.toLowerCase()}</span>
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
          )}

          <div className="grid gap-4">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
