import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Organization {
  id: string;
  name: string;
}

interface OrganizationOverviewProps {
  organization: Organization;
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  if (!organization) return null;
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{organization.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};