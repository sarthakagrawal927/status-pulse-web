import { useState } from "react";
import { ServiceCard, type Service } from "@/components/ServiceCard";
import { StatusOverview } from "@/components/StatusOverview";
import { OrganizationOverview } from "@/components/OrganizationOverview";

const mockServices: Service[] = [
  {
    id: "1",
    name: "API",
    description: "Core API services and endpoints",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Web Dashboard",
    description: "Customer-facing web dashboard",
    status: "degraded",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Database",
    description: "Primary database cluster",
    status: "operational",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "CDN",
    description: "Content delivery network",
    status: "maintenance",
    lastUpdated: new Date().toISOString(),
  },
];

const mockOrganization = {
  id: "1",
  name: "Acme Corporation",
  description: "Leading provider of cloud infrastructure and services",
  website: "https://example.com",
};

const Index = () => {
  const [services, setServices] = useState<Service[]>(mockServices);

  const handleUpdateService = (updatedService: Service) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <OrganizationOverview organization={mockOrganization} />
          <StatusOverview services={services} />
          <div className="grid gap-4">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onUpdate={handleUpdateService}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;