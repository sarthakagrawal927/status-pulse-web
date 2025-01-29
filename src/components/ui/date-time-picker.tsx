
import { format } from "date-fns";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
}

export function DateTimePicker({ value, onChange, label, error }: DateTimePickerProps) {
  const formatDateTime = (date: Date) => {
    try {
      return format(date, "PPpp");
    } catch (error) {
      toast.error("Invalid date format");
      return "Invalid date";
    }
  };

  const handleTimeChange = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const newDate = new Date(value);
      newDate.setHours(parseInt(hours));
      newDate.setMinutes(parseInt(minutes));
      onChange(newDate);
    } catch (error) {
      toast.error("Invalid time format");
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatDateTime(value) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => date && onChange(date)}
          />
          <div className="p-3 border-t">
            <Input
              type="time"
              value={format(value, "HH:mm")}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
