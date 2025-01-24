import { useState } from "react";
import { ServiceCard, type Service } from "@/components/ServiceCard";
import { StatusOverview } from "@/components/StatusOverview";

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

const Index = () => {
  const [services] = useState<Service[]>(mockServices);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold text-center mb-8">System Status</h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <StatusOverview services={services} />
          
          <div className="grid gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;