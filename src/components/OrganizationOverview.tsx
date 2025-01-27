import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SERVICE_STATUS_COLORS } from "@/constants/colors";
import { type Service } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface Organization {
  id: string;
  name: string;
}
interface OrganizationOverviewProps {
  services: Service[];
}

export const OrganizationOverview = ({ services = [] }: OrganizationOverviewProps) => {
  const getStatusSummary = () => {
    const operational = services.filter(s => s.status === "OPERATIONAL").length;
    const total = services.length;
    return { operational, total };
  };

  const { operational, total } = getStatusSummary();
  const {user: {organization}}= useAuth();

  return (
    <Card>
      <CardHeader>
        {organization && <CardTitle className="text-2xl font-bold">{organization.name}</CardTitle>}
        <CardTitle className="text-2xl font-bold">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge className={cn(
            "rounded-md px-2 py-1",
            operational === total 
              ? SERVICE_STATUS_COLORS.OPERATIONAL 
              : SERVICE_STATUS_COLORS.DEGRADED_PERFORMANCE
          )}>
            {operational === total ? "All Systems Operational" : `${operational}/${total} Systems Operational`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};