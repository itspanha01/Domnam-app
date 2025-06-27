
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useLanguage } from "@/context/language-context"
import { Button } from "../ui/button"
import { BarChart as BarChartIcon } from "lucide-react"

const YIELD_DATA_STORAGE_KEY = 'domnam-yield-data';

interface YieldEntry {
  id: string;
  crop: string;
  yield: number;
  harvestDate: string;
  notes?: string;
}

export function FarmSummaryChart() {
  const { t } = useLanguage();
  const [chartData, setChartData] = useState<{ crop: string; yield: number }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedYields = localStorage.getItem(YIELD_DATA_STORAGE_KEY);
      if (storedYields) {
        const parsedYields: YieldEntry[] = JSON.parse(storedYields);
        const aggregatedData = parsedYields.reduce((acc, entry) => {
          const existingCrop = acc.find(item => item.crop === entry.crop);
          if (existingCrop) {
            existingCrop.yield += entry.yield;
          } else {
            acc.push({ crop: entry.crop, yield: entry.yield });
          }
          return acc;
        }, [] as { crop: string; yield: number }[]);
        setChartData(aggregatedData);
      }
    } catch (error) {
      console.error("Failed to parse yield data from localStorage", error);
    }
  }, []);

  const chartConfig = {
    yield: {
      label: t('yield_label'),
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;
  
  if (!isMounted) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('yield_summary_title')}</CardTitle>
                <CardDescription>{t('yield_summary_description_dynamic')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full flex items-center justify-center">
                {/* Skeleton or loader can go here */}
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('yield_summary_title')}</CardTitle>
        <CardDescription>{t('yield_summary_description_dynamic')}</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
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
                tickFormatter={(value) => `${value}kg`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="yield" fill="var(--color-yield)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] w-full flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <BarChartIcon className="w-12 h-12 mb-4" />
            <p className="font-medium">{t('no_yield_data_chart')}</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/yield-tracker">{t('track_yields_button')}</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
