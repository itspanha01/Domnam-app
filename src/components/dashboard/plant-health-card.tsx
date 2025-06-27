"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function PlantHealthCard() {
  const [overallHealth, setOverallHealth] = useState(85);
  const [soilMoisture, setSoilMoisture] = useState(75);
  const [nutrientLevel, setNutrientLevel] = useState(90);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setOverallHealth(getRandomValue(70, 100));
      setSoilMoisture(getRandomValue(40, 90));
      setNutrientLevel(getRandomValue(60, 95));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const getHealthStatusText = (health: number) => {
    if (health > 90) return t('health_excellent');
    if (health > 75) return t('health_overall_healthy');
    if (health > 50) return t('health_needs_attention');
    return t('health_critical');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          {t('plant_health_card_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold font-headline">{overallHealth}%</span>
          <div className="w-full">
            <Progress value={overallHealth} className="h-3" />
            <p className="text-sm text-muted-foreground mt-1">{getHealthStatusText(overallHealth)}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <p>{t('soil_moisture')}</p>
              <p>{soilMoisture}%</p>
            </div>
            <Progress value={soilMoisture} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p>{t('nutrient_level')}</p>
              <p>{nutrientLevel}%</p>
            </div>
            <Progress value={nutrientLevel} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
