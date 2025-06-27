"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfilePictureCard } from "@/components/settings/profile-picture-card";
import { useLanguage } from "@/context/language-context";

export default function SettingsPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">{t('settings_title')}</h1>
                <p className="text-muted-foreground">
                    {t('settings_description')}
                </p>
            </div>
            <Separator />
            
            <ProfilePictureCard />
            
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>{t('appearance_title')}</CardTitle>
                    <CardDescription>{t('appearance_description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                            <Label>{t('theme_label')}</Label>
                            <p className="text-sm text-muted-foreground">{t('theme_description')}</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
