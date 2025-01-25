import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Incident {
  id: string;
  title: string;
  type: "incident" | "maintenance";
  status: "investigating" | "identified" | "monitoring" | "resolved" | "scheduled" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
  description: string;
}

const Incidents = () => {
  const [incidents] = useState<Incident[]>([
    {
      id: "1",
      title: "API Performance Degradation",
      type: "incident",
      status: "resolved",
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T12:00:00Z",
      description: "API response times were elevated due to increased traffic.",
    },
    {
      id: "2",
      title: "Database Maintenance",
      type: "maintenance",
      status: "scheduled",
      createdAt: "2024-01-25T15:00:00Z",
      updatedAt: "2024-01-25T15:00:00Z",
      description: "Scheduled database upgrade to improve performance.",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: "",
    type: "incident",
    status: "investigating",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Incident created successfully");
    setIsDialogOpen(false);
    setNewIncident({
      title: "",
      type: "incident",
      status: "investigating",
      description: "",
    });
  };

  const getStatusColor = (status: Incident["status"]) => {
    const colors: Record<Incident["status"], string> = {
      investigating: "bg-yellow-500",
      identified: "bg-orange-500",
      monitoring: "bg-blue-500",
      resolved: "bg-green-500",
      scheduled: "bg-purple-500",
      in_progress: "bg-blue-500",
      completed: "bg-green-500",
    };
    return colors[status];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Incidents & Maintenance</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Incident
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newIncident.title}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newIncident.type}
                  onValueChange={(value: "incident" | "maintenance") =>
                    setNewIncident({ ...newIncident, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Incident</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newIncident.status}
                  onValueChange={(value: Incident["status"]) =>
                    setNewIncident({ ...newIncident, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="identified">Identified</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newIncident.description}
                  onChange={(e) =>
                    setNewIncident({ ...newIncident, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Create Incident</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
          {incidents.map((incident) => (
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
};

export default Incidents;