import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SERVICE_STATUSES, type ServiceStatus } from "@/constants/service";
import { SERVICE_STATUS_COLORS } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  updatedAt: string;
}

interface CreateServiceFormProps {
  onSubmit: (service: Omit<Service, "id" | "updatedAt">) => void;
  onClose: () => void;
  service?: Service;
}

export const CreateServiceForm = ({ onSubmit, onClose, service }: CreateServiceFormProps) => {
  const [formData, setFormData] = useState<Omit<Service, "id" | "updatedAt">>({
    name: "",
    description: "",
    status: SERVICE_STATUSES.OPERATIONAL,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        status: service.status,
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return;
    }
    onSubmit(formData);
  };

  const getStatusColor = (status: ServiceStatus) => {
    return SERVICE_STATUS_COLORS[status] || "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter service name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter service description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: ServiceStatus) =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue>
              <Badge className={cn("rounded-md px-2 py-1", getStatusColor(formData.status))}>
                {formData.status.split('_').map(word => 
                  word.charAt(0) + word.slice(1).toLowerCase()
                ).join(' ')}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SERVICE_STATUSES).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                <Badge className={cn("rounded-md px-2 py-1", getStatusColor(value))}>
                  {key.split('_').map(word => 
                    word.charAt(0) + word.slice(1).toLowerCase()
                  ).join(' ')}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {service ? "Update" : "Create"} Service
        </Button>
      </div>
    </form>
  );
};