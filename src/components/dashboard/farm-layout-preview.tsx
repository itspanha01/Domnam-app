"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, LayoutGrid, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plant } from "@/components/farm-layout/farm-grid";
import { useLanguage } from "@/context/language-context";

export function FarmLayoutPreview() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [layout, setLayout] = useState<{ grid: (Plant | null)[][], rows: number, cols: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLayout() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const key = `domnam-farm-layout-${user.username}`;
        const savedLayoutRaw = localStorage.getItem(key);
        if (savedLayoutRaw) {
          setLayout(JSON.parse(savedLayoutRaw));
        }
      } catch (error) {
        console.error("Failed to load farm layout from local storage:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLayout();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-primary" />
            {t('farm_layout_preview_title')}
          </CardTitle>
          <CardDescription>{t('farm_layout_preview_description')}</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/farm-layout">
            {t('edit_layout_button')}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : layout && layout.grid.length > 0 ? (
          <div className="p-2 border rounded-lg bg-muted/20">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              }}
            >
              {layout.grid.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={cn(
                      "aspect-square rounded-sm border flex items-center justify-center",
                      cell ? "border-solid" : "border-dashed",
                    )}
                    style={cell ? { backgroundColor: `${cell.color}33`, borderColor: cell.color } : {}}
                  >
                    {cell && <Sprout className="w-3 h-3 md:w-4 md:h-4" style={{ color: cell.color }} />}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="font-medium">{t('no_layout_saved_title')}</p>
            <p className="text-sm">{t('no_layout_saved_description')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
