"use client";

import { AiTipAdvisor } from "@/components/dashboard/ai-tip-advisor";
import { FarmLayoutPreview } from "@/components/dashboard/farm-layout-preview";
import { FarmSummaryChart } from "@/components/dashboard/farm-summary-chart";
import { PlantHealthCard } from "@/components/dashboard/plant-health-card";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold">{t('dashboard')}</h1>
            <p className="text-muted-foreground">{t('dashboard_greeting', { username: user?.username || '' })}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <WeatherCard />
          <PlantHealthCard />
        </div>
        <FarmSummaryChart />
        <FarmLayoutPreview />
      </div>
      <div className="lg:col-span-1">
        <AiTipAdvisor />
      </div>
    </div>
  );
}
