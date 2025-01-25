import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Organization {
  id: string;
  name: string;
  description: string;
  website?: string;
}

interface OrganizationOverviewProps {
  organization: Organization;
}

export const OrganizationOverview = ({ organization }: OrganizationOverviewProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{organization.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{organization.description}</p>
        {organization.website && (
          <a
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Visit Website
          </a>
        )}
      </CardContent>
    </Card>
  );
};