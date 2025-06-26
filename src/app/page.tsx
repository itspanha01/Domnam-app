import { AiTipAdvisor } from "@/components/dashboard/ai-tip-advisor";
import { FarmSummaryChart } from "@/components/dashboard/farm-summary-chart";
import { PlantHealthCard } from "@/components/dashboard/plant-health-card";
import { WeatherCard } from "@/components/dashboard/weather-card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your farm.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <WeatherCard />
          <PlantHealthCard />
        </div>
        <FarmSummaryChart />
      </div>
      <div className="lg:col-span-1">
        <AiTipAdvisor />
      </div>
    </div>
  );
}
