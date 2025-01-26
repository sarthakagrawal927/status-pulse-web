import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIndicator } from "./StatusIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  lastUpdated: string;
}

interface ServiceCardProps {
  service: Service;
  onUpdate: (updatedService: Service) => void;
}

export const ServiceCard = ({ service, onUpdate }: ServiceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);

  const handleSave = () => {
    onUpdate(editedService);
    setIsEditing(false);
    toast.success("Service updated successfully");
  };

  const handleCancel = () => {
    setEditedService(service);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Input
            value={editedService.name}
            onChange={(e) =>
              setEditedService({ ...editedService, name: e.target.value })
            }
            className="max-w-[200px]"
          />
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={editedService.description}
            onChange={(e) =>
              setEditedService({ ...editedService, description: e.target.value })
            }
            className="mb-2"
          />
          <StatusIndicator
            status={editedService.status}
            onStatusChange={(newStatus) =>
              setEditedService({ ...editedService, status: newStatus })
            }
            editable
          />
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {new Date(service.lastUpdated).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <StatusIndicator status={service.status} />
        </div>
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