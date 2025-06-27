"use client";

import { FarmGrid } from "@/components/farm-layout/farm-grid";
import { useLanguage } from "@/context/language-context";

export default function FarmLayoutPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">{t('farm_layout_title')}</h1>
        <p className="text-muted-foreground">
          {t('farm_layout_description')}
        </p>
      </div>
      <FarmGrid />
    </div>
  );
}
