import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarDays, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { cn } from "@/lib/utils";
import { API_FUNCTIONS } from "@/lib/api";
import type { ServiceWithMaintenance, Maintenance } from "@/types";

interface MaintenanceFormData {
  start: Date;
  end: Date;
  notes?: string;
  serviceId: string;
}

interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}

/**
 * Renders a page to manage maintenance windows for services.
 * Users can view, add, edit, and delete maintenance windows.
 *
 * @returns The component to render
 */
export default function ServiceMaintenance() {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceWithMaintenance[]>([]);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState<MaintenanceFormData>({
    start: new Date(),
    end: new Date(),
    notes: "",
    serviceId: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, err } = await API_FUNCTIONS.getMaintenances();
      if (err) {
        throw new Error(err.data.message || "Failed to fetch services");
      }
      if (data) {
        setServices(data);
        // Combine all maintenances from all services
        const allMaintenances = data.flatMap(service => 
          service.ServiceMaintenance.map(maintenance => ({
            ...maintenance,
            service: {
              id: service.id,
              name: service.name
            }
          }))
        );
        setMaintenances(allMaintenances);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenDialog = (maintenance?: Maintenance) => {
    if (maintenance) {
      setSelectedMaintenance(maintenance);
      setFormData({
        start: new Date(maintenance.start),
        end: new Date(maintenance.end),
        notes: maintenance.notes,
        serviceId: maintenance.service.id,
      });
    } else {
      setSelectedMaintenance(null);
      setFormData({
        start: new Date(),
        end: new Date(),
        notes: "",
        serviceId: "",
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMaintenance(null);
    setFormData({
      start: new Date(),
      end: new Date(),
      notes: "",
      serviceId: "",
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, err } = selectedMaintenance
        ? await API_FUNCTIONS.updateMaintenance(selectedMaintenance.id, formData)
        : await API_FUNCTIONS.createMaintenance(formData);

      if (err) {
        if (err.data.errors) {
          const errors: Record<string, string> = {};
          err.data.errors.forEach(({ field, message }) => {
            errors[field] = message;
          });
          setFormErrors(errors);
          return;
        }
        throw new Error(err.data.message || "Failed to save maintenance");
      }

      toast({
        title: "Success",
        description: `Maintenance ${selectedMaintenance ? "updated" : "scheduled"} successfully`,
      });
      handleCloseDialog();
      fetchServices();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this maintenance?")) return;

    try {
      const { err } = await API_FUNCTIONS.deleteMaintenance(id);
      if (err) {
        throw new Error(err.data.message || "Failed to delete maintenance");
      }

      toast({
        title: "Success",
        description: "Maintenance deleted successfully",
      });
      fetchServices();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Service Maintenance</h1>
        <Button onClick={() => handleOpenDialog()}>Schedule Maintenance</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maintenances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No maintenance windows scheduled
              </TableCell>
            </TableRow>
          ) : (
            maintenances.map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell>{maintenance.service.name}</TableCell>
                <TableCell>{format(new Date(maintenance.start), "PPpp")}</TableCell>
                <TableCell>{format(new Date(maintenance.end), "PPpp")}</TableCell>
                <TableCell>{maintenance.notes}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(maintenance)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(maintenance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMaintenance ? "Edit" : "Schedule"} Maintenance
            </DialogTitle>
            <DialogDescription>
              Set the maintenance window for your service
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Service</Label>
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, serviceId: value }))
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
                {formErrors.serviceId && (
                  <p className="text-sm text-red-500">{formErrors.serviceId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start ? (
                        format(formData.start, "PPpp")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start}
                      onSelect={(date) =>
                        date &&
                        setFormData((prev) => ({ ...prev, start: date }))
                      }
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        value={format(formData.start, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(formData.start);
                          newDate.setHours(parseInt(hours));
                          newDate.setMinutes(parseInt(minutes));
                          setFormData((prev) => ({ ...prev, start: newDate }));
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {formErrors.start && (
                  <p className="text-sm text-red-500">{formErrors.start}</p>
                )}
              </div>

              <div className="space-y-2">
                <DateTimePicker
                  label="End Time"
                  value={formData.end}
                  onChange={(date) => setFormData((prev) => ({ ...prev, end: date }))}
                  error={formErrors.end}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add any additional notes..."
                />
                {formErrors.notes && (
                  <p className="text-sm text-red-500">{formErrors.notes}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedMaintenance ? "Update" : "Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
