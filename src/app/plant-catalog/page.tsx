"use client";

import { useState } from "react";
import { PlantCard } from "@/components/plant-catalog/plant-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const initialPlants = [
  {
    name: "Heirloom Tomato",
    image: "https://placehold.co/600x400.png",
    hint: "tomato plant",
    description: "Rich, full-flavored tomatoes perfect for salads and sauces. Requires full sun and regular watering.",
  },
  {
    name: "Butterhead Lettuce",
    image: "https://placehold.co/600x400.png",
    hint: "lettuce field",
    description: "Soft, buttery leaves that form a loose head. Ideal for cool weather and partial shade.",
  },
  {
    name: "Sweet Basil",
    image: "https://placehold.co/600x400.png",
    hint: "basil pot",
    description: "Aromatic herb essential for Italian cuisine. Thrives in warm, sunny locations.",
  },
  {
    name: "Bell Pepper",
    image: "https://placehold.co/600x400.png",
    hint: "bell pepper",
    description: "Sweet and crunchy peppers available in various colors. Needs a long, warm growing season.",
  },
  {
    name: "Lavender",
    image: "https://placehold.co/600x400.png",
    hint: "lavender field",
    description: "Fragrant purple flowers known for their calming properties. Prefers dry, sunny conditions.",
  },
  {
    name: "Mint",
    image: "https://placehold.co/600x400.png",
    hint: "mint plant",
    description: "A fast-spreading herb perfect for teas and cocktails. Best grown in containers to control its spread.",
  },
];


export default function PlantCatalogPage() {
  const [plants, setPlants] = useState(initialPlants);
  const [searchTerm, setSearchTerm] = useState("");

  const handleImageChange = (name: string, image: string) => {
    setPlants(plants.map(p => p.name === name ? { ...p, image } : p));
  };
  
  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Plant Catalog</h1>
        <p className="text-muted-foreground">
          Browse available plants and add your own to the farm.
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for plants..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard 
            key={plant.name}
            {...plant}
            onImageChange={handleImageChange}
          />
        ))}
      </div>
    </div>
  );
}
