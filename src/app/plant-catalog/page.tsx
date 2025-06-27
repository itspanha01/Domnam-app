"use client";

import { useState, useEffect } from "react";
import { PlantCard } from "@/components/plant-catalog/plant-card";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPlantDialog } from "@/components/plant-catalog/add-plant-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/language-context";

export interface Plant {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  aiHint: string;
}

export default function PlantCatalogPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const initialPlants: Plant[] = [
      {
        id: "1",
        name: t('plant_heirloom_tomato_name'),
        type: t('vegetable'),
        image: "https://placehold.co/600x400.png",
        aiHint: "tomato plant",
        description: t('plant_heirloom_tomato_desc'),
      },
      {
        id: "2",
        name: t('plant_butterhead_lettuce_name'),
        type: t('vegetable'),
        image: "https://placehold.co/600x400.png",
        aiHint: "lettuce field",
        description: t('plant_butterhead_lettuce_desc'),
      },
      {
        id: "3",
        name: t('plant_sweet_basil_name'),
        type: t('herb'),
        image: "https://placehold.co/600x400.png",
        aiHint: "basil pot",
        description: t('plant_sweet_basil_desc'),
      },
      {
        id: "4",
        name: t('plant_bell_pepper_name'),
        type: t('vegetable'),
        image: "https://placehold.co/600x400.png",
        aiHint: "bell pepper",
        description: t('plant_bell_pepper_desc'),
      },
      {
        id: "5",
        name: t('plant_lavender_name'),
        type: t('flower'),
        image: "https://placehold.co/600x400.png",
        aiHint: "lavender field",
        description: t('plant_lavender_desc'),
      },
      {
        id: "6",
        name: t('plant_mint_name'),
        type: t('herb'),
        image: "https://placehold.co/600x400.png",
        aiHint: "mint plant",
        description: t('plant_mint_desc'),
      },
    ];

    setIsMounted(true);
    try {
        const storedPlants = localStorage.getItem('domnam-plant-catalog');
        if (storedPlants) {
            setPlants(JSON.parse(storedPlants));
        } else {
            setPlants(initialPlants);
        }
    } catch (error) {
        console.error("Failed to parse plants from localStorage", error);
        setPlants(initialPlants);
    }
  }, [t]);

  useEffect(() => {
    if (isMounted) {
        localStorage.setItem('domnam-plant-catalog', JSON.stringify(plants));
    }
  }, [plants, isMounted]);

  const handleAddPlant = (newPlant: Omit<Plant, 'id'>) => {
    const plantWithId = { ...newPlant, id: crypto.randomUUID() };
    setPlants(prevPlants => [...prevPlants, plantWithId]);
    setAddDialogOpen(false);
  };

  const handleImageChange = (id: string, image: string) => {
    setPlants(plants.map(p => (p.id === id ? { ...p, image } : p)));
  };
  
  const handleDeleteRequest = (id: string) => {
    const plant = plants.find((p) => p.id === id);
    if (plant) {
      setPlantToDelete(plant);
    }
  };

  const handleConfirmDelete = () => {
    if (plantToDelete) {
      setPlants((prevPlants) => prevPlants.filter((p) => p.id !== plantToDelete.id));
      setPlantToDelete(null);
    }
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">{t('plant_catalog_title')}</h1>
        <p className="text-muted-foreground">
          {t('plant_catalog_description')}
        </p>
      </div>
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('search_placeholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t('add_new_plant_button')}
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard 
            key={plant.id}
            {...plant}
            onImageChange={handleImageChange}
            onDeleteRequest={handleDeleteRequest}
          />
        ))}
      </div>
      <AddPlantDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onPlantAdd={handleAddPlant}
      />
      <AlertDialog open={!!plantToDelete} onOpenChange={(open) => !open && setPlantToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>{t('delete_confirmation_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                      {t('delete_confirmation_description', { plantName: plantToDelete?.name || '' })}
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPlantToDelete(null)}>{t('cancel_button')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('delete_button')}</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
