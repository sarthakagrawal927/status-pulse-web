import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Incident {
  id: string;
  title: string;
  type: "incident" | "maintenance";
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceId: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

interface IncidentsTableProps {
  incidents: Incident[];
  services: Service[];
}

export const IncidentsTable = ({ incidents, services }: IncidentsTableProps) => {
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
            <h3 className="text-lg font-semibold mb-4">{service?.name || 'Unknown Service'}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.title}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </div>
  );
};