"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlantCardProps {
  name: string;
  image: string;
  hint: string;
  description: string;
  onImageChange: (name: string, image: string) => void;
}

export function PlantCard({ name, image, hint, description, onImageChange }: PlantCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please select an image file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageChange(name, result);
        }
      };
      reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "Error Reading File",
            description: "Could not read the selected file. Please try again.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <div className="aspect-video relative rounded-t-lg overflow-hidden -mt-6 -mx-6 mb-4 shadow-lg">
          <Image src={image} alt={name} fill style={{objectFit:"cover"}} data-ai-hint={hint} />
        </div>
        <CardTitle className="font-headline">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={handleButtonClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </CardFooter>
    </Card>
  );
}
