import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { INCIDENT_STATUSES, type IncidentStatus } from "@/constants/incident";
import { INCIDENT_STATUS_COLORS } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface CreateUpdateFormProps {
  onSubmit: (update: { message: string; status: IncidentStatus }) => void;
  currentStatus: IncidentStatus;
}

export const CreateUpdateForm = ({ onSubmit, currentStatus }: CreateUpdateFormProps) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<IncidentStatus>(currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Update message is required");
      return;
    }
    onSubmit({ message, status });
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Update Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the current situation..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: IncidentStatus) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue>
              <Badge className={cn("rounded-md px-2 py-1", INCIDENT_STATUS_COLORS[status])}>
                {formatStatus(status)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(INCIDENT_STATUSES).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                <Badge className={cn("rounded-md px-2 py-1", INCIDENT_STATUS_COLORS[value])}>
                  {formatStatus(key)}
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Add Update
      </Button>
    </form>
  );
};