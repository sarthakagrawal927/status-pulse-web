import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusIndicator } from "@/components/StatusIndicator";
import { toast } from "sonner";
import type { Service } from "@/components/ServiceCard";

interface CreateServiceFormProps {
  onSubmit: (service: Omit<Service, "id" | "lastUpdated">) => void;
  onClose: () => void;
  initialData?: Service;
}

export const CreateServiceForm = ({ onSubmit, onClose, initialData }: CreateServiceFormProps) => {
  const [formData, setFormData] = useState<Omit<Service, "id" | "lastUpdated">>({
    name: "",
    description: "",
    status: "operational",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please enter a service name");
      return;
    }
    onSubmit(formData);
    toast.success(`Service ${initialData ? "updated" : "created"} successfully`);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
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
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <StatusIndicator
          status={formData.status}
          onStatusChange={(newStatus) =>
            setFormData({ ...formData, status: newStatus })
          }
          editable
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">{initialData ? "Update" : "Create"} Service</Button>
      </div>
    </form>
  );
};