import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface PlantCardProps {
  name: string;
  image: string;
  hint: string;
  description: string;
}

export function PlantCard({ name, image, hint, description }: PlantCardProps) {
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
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Upload New Image
        </Button>
      </CardFooter>
    </Card>
  );
}
