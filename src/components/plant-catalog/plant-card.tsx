
"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PlantCardProps {
  id: string;
  name: string;
  image: string;
  aiHint: string;
  description: string;
  type: string;
  onImageChange: (id: string, image: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function PlantCard({ id, name, image, aiHint, description, type, onImageChange, onDeleteRequest }: PlantCardProps) {
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
          onImageChange(id, result);
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
          <Image src={image} alt={name} fill style={{objectFit:"cover"}} data-ai-hint={aiHint} />
        </div>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="font-headline">{name}</CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap shrink-0">{type}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="w-full" onClick={handleButtonClick}>
          <Upload className="mr-2 h-4 w-4" />
          Change Image
        </Button>
        <Button variant="destructive" size="sm" className="w-full" onClick={() => onDeleteRequest(id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
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
