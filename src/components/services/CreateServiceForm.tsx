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
  onDelete?: () => void;
}

export const CreateServiceForm = ({ onSubmit, onClose, initialData, onDelete }: CreateServiceFormProps) => {
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
    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return;
    }
    onSubmit(formData);
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
      {initialData && (
        <div className="space-y-2">
          <Label>Status</Label>
          <StatusIndicator status={formData.status} />
        </div>
      )}
      <div className="flex justify-between pt-4">
        <div className="space-x-2">
          <Button type="submit" variant="default">
            {initialData ? "Update" : "Create"} Service
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this service?")) {
                onDelete();
                toast.success("Service deleted successfully");
                onClose();
              }
            }}
          >
            Delete Service
          </Button>
        )}
      </div>
    </form>
  );
};