
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Plant } from "@/app/plant-catalog/page";

type NewPlant = Omit<Plant, "id">;

interface AddPlantDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPlantAdd: (plant: NewPlant) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.string().optional(),
  description: z.string().optional(),
  aiHint: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export function AddPlantDialog({ isOpen, onOpenChange, onPlantAdd }: AddPlantDialogProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      aiHint: "",
    },
  });

  const handleDialogStateChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setImagePreview(null);
    }
    onOpenChange(open);
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
        form.resetField("image");
        setImagePreview(null);
        return;
      }
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    const completeSubmit = (imageDataUrl: string) => {
      onPlantAdd({
        name: values.name,
        type: values.type || '',
        description: values.description || '',
        image: imageDataUrl,
        aiHint: values.aiHint || '',
      });
      setIsSubmitting(false);
    };

    if (values.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        completeSubmit(reader.result as string);
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error Reading File",
          description: "Could not process the image. Please try again.",
        });
        setIsSubmitting(false);
      };
      reader.readAsDataURL(values.image);
    } else {
      completeSubmit("https://placehold.co/600x400.png");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add a New Plant</DialogTitle>
          <DialogDescription>Fill in the details for your new plant to add it to the catalog.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Image <span className="text-muted-foreground">(Optional)</span></FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <div className="aspect-video relative bg-muted/50 rounded-md flex items-center justify-center border-2 border-dashed">
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Plant preview" fill className="object-cover rounded-md" />
                        ) : (
                          <div className="text-center text-muted-foreground p-4">
                            <ImageIcon className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">Upload an image</p>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        className="mt-2"
                        onChange={handleFileChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cherry Tomato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Type <span className="text-muted-foreground">(Optional)</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Vegetable">Vegetable</SelectItem>
                      <SelectItem value="Fruit">Fruit</SelectItem>
                      <SelectItem value="Herb">Herb</SelectItem>
                      <SelectItem value="Flower">Flower</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-muted-foreground">(Optional)</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the plant's characteristics and care needs." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="aiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Image Hint <span className="text-muted-foreground">(Optional)</span></FormLabel>
                   <FormControl>
                    <Input placeholder="e.g. 'tomato plant' or 'basil pot'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogStateChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Plant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
