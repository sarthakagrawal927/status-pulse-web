import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
}

interface CreateIncidentFormProps {
  onSubmit: (incident: any) => void;
  onClose: () => void;
  services: Service[];
}

export const CreateIncidentForm = ({ onSubmit, onClose, services }: CreateIncidentFormProps) => {
  const [newIncident, setNewIncident] = useState({
    title: "",
    type: "incident" as "incident" | "maintenance",
    status: "investigating",
    description: "",
    serviceId: "",
    startTime: "",
    endTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncident.serviceId) {
      toast.error("Please select a service");
      return;
    }
    if (newIncident.type === "maintenance" && (!newIncident.startTime || !newIncident.endTime)) {
      toast.error("Please set start and end times for maintenance");
      return;
    }
    onSubmit(newIncident);
    toast.success("Incident created successfully");
    onClose();
    setNewIncident({
      title: "",
      type: "incident",
      status: "investigating",
      description: "",
      serviceId: "",
      startTime: "",
      endTime: "",
    });
  };

  return (
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
        <Label htmlFor="service">Service</Label>
        <Select
          value={newIncident.serviceId}
          onValueChange={(value) =>
            setNewIncident({ ...newIncident, serviceId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      {newIncident.type === "maintenance" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={newIncident.startTime}
              onChange={(e) =>
                setNewIncident({ ...newIncident, startTime: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={newIncident.endTime}
              onChange={(e) =>
                setNewIncident({ ...newIncident, endTime: e.target.value })
              }
              required
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={newIncident.status}
          onValueChange={(value) =>
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
  );
};