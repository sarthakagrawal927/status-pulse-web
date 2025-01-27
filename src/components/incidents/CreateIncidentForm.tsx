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
import {
  INCIDENT_TYPES,
  INCIDENT_STATUSES,
  INCIDENT_IMPACTS,
  type IncidentType,
  type IncidentStatus,
  type IncidentImpact
} from "@/constants/incident";

interface Service {
  id: string;
  name: string;
}

interface CreateIncidentFormProps {
  onSubmit: (incident: {
    title: string;
    type: IncidentType;
    status: IncidentStatus;
    impact: IncidentImpact;
    description: string;
    serviceId: string;
    startTime?: string;
    endTime?: string;
  }) => void;
  onClose: () => void;
  services: Service[];
}

export const CreateIncidentForm = ({ onSubmit, onClose, services }: CreateIncidentFormProps) => {
  const [newIncident, setNewIncident] = useState({
    title: "",
    type: INCIDENT_TYPES.INCIDENT as IncidentType,
    status: INCIDENT_STATUSES.INVESTIGATING as IncidentStatus,
    impact: INCIDENT_IMPACTS.MINOR as IncidentImpact,
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
    if (newIncident.type === INCIDENT_TYPES.MAINTENANCE && (!newIncident.startTime || !newIncident.endTime)) {
      toast.error("Please set start and end times for maintenance");
      return;
    }
    onSubmit(newIncident);
    toast.success("Incident created successfully");
    onClose();
    setNewIncident({
      title: "",
      type: INCIDENT_TYPES.INCIDENT,
      status: INCIDENT_STATUSES.INVESTIGATING,
      impact: INCIDENT_IMPACTS.MINOR,
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
      {/* <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={newIncident.type}
          onValueChange={(value: IncidentType) =>
            setNewIncident({ ...newIncident, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={INCIDENT_TYPES.INCIDENT}>Incident</SelectItem>
            <SelectItem value={INCIDENT_TYPES.MAINTENANCE}>Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
      <div className="space-y-2">
        <Label htmlFor="impact">Impact</Label>
        <Select
          value={newIncident.impact}
          onValueChange={(value: IncidentImpact) =>
            setNewIncident({ ...newIncident, impact: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={INCIDENT_IMPACTS.MINOR}>Minor</SelectItem>
            <SelectItem value={INCIDENT_IMPACTS.MAJOR}>Major</SelectItem>
            <SelectItem value={INCIDENT_IMPACTS.CRITICAL}>Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {newIncident.type === INCIDENT_TYPES.MAINTENANCE && (
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
          onValueChange={(value: IncidentStatus) =>
            setNewIncident({ ...newIncident, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INCIDENT_STATUSES).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
              </SelectItem>
            ))}
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