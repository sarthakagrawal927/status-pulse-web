import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SERVICE_STATUS_COLORS } from "@/constants/colors";
import { type Service } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { API_FUNCTIONS } from "@/lib/api";

interface Organization {
  id: string;
  name: string;
}

interface OrganizationOverviewProps {
  services: Service[];
  organizationId?: string;
}

export const OrganizationOverview = ({ services = [], organizationId }: OrganizationOverviewProps) => {
  const { user } = useAuth();
  const [orgData, setOrgData] = useState<Organization | null>(null);

  const getStatusSummary = () => {
    const operational = services.filter(s => s.status === "OPERATIONAL").length;
    const total = services.length;
    return { operational, total };
  };

  const { operational, total } = getStatusSummary();

  useEffect(() => {
    const fetchOrgData = async () => {
      if (organizationId && !user) {
        try {
          const response = await API_FUNCTIONS.getOrganizationById(organizationId);
          if (response.data) {
            setOrgData(response.data);
          }
        } catch (error) {
          console.error("Error fetching organization:", error);
        }
      }
    };

    fetchOrgData();
  }, [organizationId, user]);

  // Use authenticated user's org data if available, otherwise use fetched org data
  const organization = user?.organization || orgData;

  if (!organization) {
    return (
      <div className="text-center text-lg text-muted-foreground">
        No organization found
      </div>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{organization.name}</h2>
            <p className="text-sm text-muted-foreground">Service Status Overview</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Status</span>
              <span>
                {operational} / {total} operational
              </span>
            </div>
            <Progress
              value={(operational / total) * 100}
              className={`h-2 ${SERVICE_STATUS_COLORS.OPERATIONAL}`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};