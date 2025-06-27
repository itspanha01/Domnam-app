"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function ProfilePictureCard() {
    const { user, updateProfilePicture } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({
                variant: "destructive",
                title: t('invalid_file_type_title'),
                description: t('invalid_file_type_description_image_ext'),
            });
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const dataUrl = reader.result as string;
            try {
                await updateProfilePicture(dataUrl);
                toast({
                    title: t('upload_success_title'),
                    description: t('upload_success_description'),
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: t('upload_failed_title'),
                    description: error.message || t('upload_failed_description'),
                });
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>{t('profile_picture_title')}</CardTitle>
                <CardDescription>{t('profile_picture_description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    <AvatarFallback>
                        <User className="h-10 w-10" />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <Button onClick={handleUploadClick} disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Camera className="mr-2 h-4 w-4" />
                        )}
                        {t('upload_new_photo_button')}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        {t('upload_recommended_size')}
                    </p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </CardContent>
        </Card>
    );
}
