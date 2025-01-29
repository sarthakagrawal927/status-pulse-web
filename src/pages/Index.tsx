import { OrganizationOverview } from "@/components/OrganizationOverview";
import { StatusOverview } from "@/components/StatusOverview";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INCIDENT_STATUSES, type IncidentImpact } from "@/constants/incident";
import { ACTION_TYPES } from "@/constants/action";
import { API_FUNCTIONS } from "@/lib/api";
import { type Service, type UserAction } from "@/types";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Users, Server, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useMultiSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

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

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case ACTION_TYPES.INCIDENT_CREATED:
      case ACTION_TYPES.INCIDENT_UPDATED:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case ACTION_TYPES.INCIDENT_RESOLVED:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case ACTION_TYPES.SERVICE_STATUS_CHANGED:
        return <Server className="h-4 w-4 text-blue-500" />;
      case ACTION_TYPES.MEMBER_INVITED:
      case ACTION_TYPES.MEMBER_JOINED:
      case ACTION_TYPES.MEMBER_REMOVED:
      case ACTION_TYPES.MEMBER_LEFT:
      case ACTION_TYPES.ROLE_UPDATED:
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadge = (actionType: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    let className = "font-semibold";

    switch (actionType) {
      case ACTION_TYPES.INCIDENT_CREATED:
        variant = "destructive";
        break;
      case ACTION_TYPES.INCIDENT_RESOLVED:
        className = "bg-green-500 text-white";
        break;
      case ACTION_TYPES.MEMBER_INVITED:
      case ACTION_TYPES.MEMBER_JOINED:
        variant = "secondary";
        className = "bg-purple-500 text-white";
        break;
      case ACTION_TYPES.MEMBER_REMOVED:
      case ACTION_TYPES.MEMBER_LEFT:
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }

    return (
      <Badge variant={variant} className={className}>
        {actionType.replace(/_/g, ' ')}
      </Badge>
    );
  };

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(true);

  const {user} = useAuth();
  const { organizationId } = useParams();

  // Handle real-time updates for both actions and incidents
  useMultiSocket({
    organizationId: user?.organization?.id || organizationId || "",
    events: [
      {
        type: "action",
        callback: (action) => {
          // Update actions list
          setActions(prev => [action.data, ...prev]);

          // Show toast notification
          toast(action.data.description, {
            description: new Date(action.data.createdAt).toLocaleString(),
          });

          // Update services state based on action type
          if (action.data.actionType === ACTION_TYPES.SERVICE_STATUS_CHANGED) {
            setServices(prev => prev.map(service => {
              if (service.id === action.data.serviceId) {
                return {
                  ...service,
                  status: action.data.metadata?.status || service.status
                };
              }
              return service;
            }));
          } else if (
            action.data.actionType === ACTION_TYPES.INCIDENT_CREATED ||
            action.data.actionType === ACTION_TYPES.INCIDENT_UPDATED ||
            action.data.actionType === ACTION_TYPES.INCIDENT_RESOLVED
          ) {
            setServices(prev => prev.map(service => {
              if (service.id === action.data.serviceId) {
                const updatedIncidents = service.incidents || [];

                if (action.data.actionType === ACTION_TYPES.INCIDENT_CREATED && action.data.metadata?.incident) {
                  // Add new incident
                  updatedIncidents.unshift(action.data.metadata.incident);
                } else {
                  // Update existing incident
                  const incidentIndex = updatedIncidents.findIndex(inc => inc.id === action.data.incidentId);
                  console.log({incidentIndex})
                  if (incidentIndex !== -1) {
                    updatedIncidents[incidentIndex].status = action.data.metadata.status;
                    // updatedIncidents[incidentIndex].updates = [...(updatedIncidents[incidentIndex].updates || []), action.data.metadata.update];
                  }
                }

                return {
                  ...service,
                  incidents: updatedIncidents
                };
              }
              return service;
            }));
          }
        },
      },
      // {
      //   type: "incident",
      //   callback: (incident) => {
      //     // Refresh services data when incident is updated
      //     fetchData();

      //     // Show toast notification
      //     toast.info(`Incident Update: ${incident.data.title}`, {
      //       description: incident.data.description,
      //     });
      //   },
      // },
    ],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesResponse, actionsResponse] = await Promise.all([
        API_FUNCTIONS.getServices(organizationId),
        API_FUNCTIONS.getUserActions(organizationId)
      ]);

      if (servicesResponse.data) {
        setServices(servicesResponse.data);
      }
      if (actionsResponse.data) {
        setActions(actionsResponse.data.actions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <OrganizationOverview services={services} organizationId={organizationId} />
          <StatusOverview services={services} />

          <Tabs defaultValue="services" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services & Incidents</TabsTrigger>
              <TabsTrigger value="actions">Activity Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-6">
              <div className="grid gap-6">
                {services.map((service) => {
                  const activeIncidents = service.incidents?.filter(
                    incident => incident.status !== INCIDENT_STATUSES.RESOLVED
                  ) || [];

                  return (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <Badge 
                            variant={service.status === 'OPERATIONAL' ? 'outline' : 'destructive'}
                            className={
                              service.status === 'OPERATIONAL' 
                                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500'
                                : 'bg-red-500'
                            }
                          >
                            {service.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>

                        {activeIncidents.length > 0 && (
                          <div className="space-y-4">
                            {activeIncidents.map((incident) => {
                              const latestUpdate = incident.updates?.[0];

                              return (
                                <div 
                                  key={incident.id} 
                                  className={`
                                    rounded-lg border p-4 space-y-3
                                    ${incident.impact === 'CRITICAL' ? 'border-red-500/50 bg-red-500/5' :
                                      incident.impact === 'MAJOR' ? 'border-orange-500/50 bg-orange-500/5' :
                                      'border-yellow-500/50 bg-yellow-500/5'}
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {getImpactBadge(incident.impact)}
                                      <Badge
                                        variant="secondary"
                                        className={cn(
                                          "capitalize",
                                          incident.status === INCIDENT_STATUSES.INVESTIGATING && "bg-yellow-500/20 text-yellow-600",
                                          incident.status === INCIDENT_STATUSES.IDENTIFIED && "bg-orange-500/20 text-orange-600",
                                          incident.status === INCIDENT_STATUSES.MONITORING && "bg-blue-500/20 text-blue-600",
                                          incident.status === INCIDENT_STATUSES.RESOLVED && "bg-green-500/20 text-green-600"
                                        )}
                                      >
                                        {incident.status.toLowerCase()}
                                      </Badge>
                                      <h4 className="font-medium">{incident.title}</h4>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(incident.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  {latestUpdate && (
                                    <div className="flex items-start gap-2 text-sm">
                                      {getStatusIcon(latestUpdate.status)}
                                      <div>
                                        <p className="font-medium capitalize mb-1">
                                          {latestUpdate.status.toLowerCase()}
                                        </p>
                                        <p className="text-muted-foreground">
                                          {latestUpdate.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {new Date(latestUpdate.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {activeIncidents.length === 0 && (
                          <div className="text-sm text-muted-foreground mt-2">
                            No active incidents
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="actions">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Activity Timeline</h2>
                <div className="space-y-6">
                  {actions.map((action) => (
                    <div key={action.id} className="border-l-2 border-primary pl-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          {getActionIcon(action.actionType)}
                          {getActionBadge(action.actionType)}
                        </div>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(action.createdAt).toLocaleString()}</span>
                          {action.metadata && (
                            <span className="text-xs text-muted-foreground">
                              {JSON.stringify(action.metadata)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {actions.length === 0 && (
                    <p className="text-center text-muted-foreground">No activities found</p>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
