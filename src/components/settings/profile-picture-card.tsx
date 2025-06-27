"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Loader2 } from "lucide-react";

export function ProfilePictureCard() {
    const { user, updateProfilePicture } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({
                variant: "destructive",
                title: "Invalid File Type",
                description: "Please select an image file (e.g., PNG, JPG).",
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
                    title: "Success",
                    description: "Your profile picture has been updated.",
                });
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: error.message || "Could not update profile picture. Please try again.",
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
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile photo.</CardDescription>
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
                        Upload New Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Recommended size: 256x256px.
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
