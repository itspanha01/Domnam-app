
"use client";

import { useState, useEffect } from "react";
import { PlantCard } from "@/components/plant-catalog/plant-card";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPlantDialog } from "@/components/plant-catalog/add-plant-dialog";

export interface Plant {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
  aiHint: string;
}

const initialPlants: Plant[] = [
  {
    id: "1",
    name: "Heirloom Tomato",
    type: "Vegetable",
    image: "https://placehold.co/600x400.png",
    aiHint: "tomato plant",
    description: "Rich, full-flavored tomatoes perfect for salads and sauces. Requires full sun and regular watering.",
  },
  {
    id: "2",
    name: "Butterhead Lettuce",
    type: "Vegetable",
    image: "https://placehold.co/600x400.png",
    aiHint: "lettuce field",
    description: "Soft, buttery leaves that form a loose head. Ideal for cool weather and partial shade.",
  },
  {
    id: "3",
    name: "Sweet Basil",
    type: "Herb",
    image: "https://placehold.co/600x400.png",
    aiHint: "basil pot",
    description: "Aromatic herb essential for Italian cuisine. Thrives in warm, sunny locations.",
  },
  {
    id: "4",
    name: "Bell Pepper",
    type: "Vegetable",
    image: "https://placehold.co/600x400.png",
    aiHint: "bell pepper",
    description: "Sweet and crunchy peppers available in various colors. Needs a long, warm growing season.",
  },
  {
    id: "5",
    name: "Lavender",
    type: "Flower",
    image: "https://placehold.co/600x400.png",
    aiHint: "lavender field",
    description: "Fragrant purple flowers known for their calming properties. Prefers dry, sunny conditions.",
  },
  {
    id: "6",
    name: "Mint",
    type: "Herb",
    image: "https://placehold.co/600x400.png",
    aiHint: "mint plant",
    description: "A fast-spreading herb perfect for teas and cocktails. Best grown in containers to control its spread.",
  },
];


export default function PlantCatalogPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
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
  }, []);

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
        <h1 className="text-3xl font-headline font-bold">Plant Catalog</h1>
        <p className="text-muted-foreground">
          Browse available plants and add your own to the farm.
        </p>
      </div>
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for plants..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Plant
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard 
            key={plant.id}
            {...plant}
            onImageChange={handleImageChange}
          />
        ))}
      </div>
      <AddPlantDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onPlantAdd={handleAddPlant}
      />
    </div>
  );
}
