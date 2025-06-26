import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf } from "lucide-react";

export function PlantHealthCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          Plant Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold font-headline">85%</span>
          <div className="w-full">
            <Progress value={85} className="h-3" />
            <p className="text-sm text-muted-foreground mt-1">Overall Healthy</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <p>Soil Moisture</p>
              <p>75%</p>
            </div>
            <Progress value={75} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p>Nutrient Level</p>
              <p>90%</p>
            </div>
            <Progress value={90} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
