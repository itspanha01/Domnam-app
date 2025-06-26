import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Sun, Thermometer, Wind } from "lucide-react";

export function WeatherCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Sun className="w-6 h-6 text-primary" />
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-5xl font-bold font-headline">28°C</span>
          <div className="text-right">
            <p className="font-semibold">Sunny</p>
            <p className="text-muted-foreground text-sm">Feels like 30°C</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <span>28°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <span>65%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span>10 km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
