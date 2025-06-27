"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useLanguage } from "@/context/language-context";

const chartData = [
  { crop: "Tomato", yield: 4000 },
  { crop: "Lettuce", yield: 3000 },
  { crop: "Carrot", yield: 2000 },
  { crop: "Potato", yield: 2780 },
  { crop: "Corn", yield: 1890 },
  { crop: "Pepper", yield: 2390 },
];

export function FarmSummaryChart() {
  const { t } = useLanguage();

  const chartConfig = {
    yield: {
      label: t('yield_label'),
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('yield_summary_title')}</CardTitle>
        <CardDescription>{t('yield_summary_description')}</CardDescription>
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
