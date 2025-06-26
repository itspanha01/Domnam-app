"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { crop: "Tomato", yield: 4000 },
  { crop: "Lettuce", yield: 3000 },
  { crop: "Carrot", yield: 2000 },
  { crop: "Potato", yield: 2780 },
  { crop: "Corn", yield: 1890 },
  { crop: "Pepper", yield: 2390 },
];

const chartConfig = {
  yield: {
    label: "Yield (kg)",
    color: "hsl(var(--primary))",
  },
};

export function FarmSummaryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Yield Summary</CardTitle>
        <CardDescription>Last month's crop yield</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="crop"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--foreground))"
              tickMargin={10}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="yield" fill="var(--color-yield)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
