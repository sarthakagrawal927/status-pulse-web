import { useState } from "react";
import { Button } from "@/components/ui/button";
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

interface CreateUpdateFormProps {
  onSubmit: (update: { status: string; message: string; incidentId: string }) => void;
  onClose: () => void;
  incidentId: string;
}

export const CreateUpdateForm = ({ onSubmit, onClose, incidentId }: CreateUpdateFormProps) => {
  const [newUpdate, setNewUpdate] = useState({
    status: "investigating",
    message: "",
    incidentId: incidentId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdate.message) {
      toast.error("Please enter an update message");
      return;
    }
    onSubmit(newUpdate);
    toast.success("Update added successfully");
    onClose();
    setNewUpdate({
      status: "investigating",
      message: "",
      incidentId: incidentId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={newUpdate.status}
          onValueChange={(value) =>
            setNewUpdate({ ...newUpdate, status: value })
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
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Update Message</Label>
        <Textarea
          id="message"
          value={newUpdate.message}
          onChange={(e) =>
            setNewUpdate({ ...newUpdate, message: e.target.value })
          }
          required
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Add Update</Button>
      </div>
    </form>
  );
};