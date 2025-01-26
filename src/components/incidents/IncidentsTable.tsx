import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, Settings, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUpdateForm } from "./CreateUpdateForm";

interface IncidentUpdate {
  id: string;
  incidentId: string;
  status: string;
  message: string;
  createdAt: string;
}

interface Incident {
  id: string;
  title: string;
  type: "incident" | "maintenance";
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
  updates?: IncidentUpdate[];
}

interface Service {
  id: string;
  name: string;
  description: string;
}

interface IncidentsTableProps {
  incidents: Incident[];
  services: Service[];
  onUpdateIncident: (updatedIncident: Incident) => void;
  onEditService: (service: Service) => void;
  onAddUpdate: (incidentId: string, update: Omit<IncidentUpdate, "id" | "createdAt">) => void;
}

export const IncidentsTable = ({ 
  incidents, 
  services, 
  onUpdateIncident, 
  onEditService,
  onAddUpdate 
}: IncidentsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedIncident, setEditedIncident] = useState<Incident | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      investigating: "bg-yellow-500",
      identified: "bg-orange-500",
      monitoring: "bg-blue-500",
      resolved: "bg-green-500",
      scheduled: "bg-purple-500",
      in_progress: "bg-blue-500",
      completed: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const handleSave = (incident: Incident) => {
    if (editedIncident) {
      onUpdateIncident(editedIncident);
      setEditingId(null);
      setEditedIncident(null);
      toast.success("Incident updated successfully");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedIncident(null);
  };

  const startEditing = (incident: Incident) => {
    setEditingId(incident.id);
    setEditedIncident(incident);
  };

  // Group incidents by service
  const groupedIncidents = incidents.reduce((acc, incident) => {
    const serviceId = incident.serviceId;
    if (!acc[serviceId]) {
      acc[serviceId] = [];
    }
    acc[serviceId].push(incident);
    return acc;
  }, {} as Record<string, Incident[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedIncidents).map(([serviceId, serviceIncidents]) => {
        const service = services.find(s => s.id === serviceId);
        return (
          <div key={serviceId} className="rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{service?.name || 'Unknown Service'}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => service && onEditService(service)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceIncidents.map((incident) => (
                  <>
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">
                        {editingId === incident.id ? (
                          <Input
                            value={editedIncident?.title}
                            onChange={(e) =>
                              setEditedIncident(prev => prev ? { ...prev, title: e.target.value } : null)
                            }
                          />
                        ) : (
                          incident.title
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={incident.type === "incident" ? "destructive" : "secondary"}>
                          {incident.type === "incident" ? "Incident" : "Maintenance"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status.replace("_", " ").charAt(0).toUpperCase() +
                            incident.status.slice(1).replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(incident.createdAt).toLocaleString()}</TableCell>
                      <TableCell>{new Date(incident.updatedAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingId === incident.id ? (
                            <>
                              <Button size="icon" variant="ghost" onClick={handleCancel}>
                                <X className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleSave(incident)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEditing(incident)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Dialog open={selectedIncidentId === incident.id} onOpenChange={(open) => setSelectedIncidentId(open ? incident.id : null)}>
                                <DialogTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MessageSquarePlus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Update to {incident.title}</DialogTitle>
                                  </DialogHeader>
                                  <CreateUpdateForm
                                    incidentId={incident.id}
                                    onSubmit={(update) => {
                                      onAddUpdate(incident.id, update);
                                      setSelectedIncidentId(null);
                                    }}
                                    onClose={() => setSelectedIncidentId(null)}
                                  />
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {incident.updates && incident.updates.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/50">
                          <div className="space-y-2 p-2">
                            <h4 className="font-semibold text-sm">Updates</h4>
                            {incident.updates.map((update) => (
                              <div key={update.id} className="border-l-2 border-primary pl-4 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getStatusColor(update.status)}>
                                    {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(update.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{update.message}</p>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};