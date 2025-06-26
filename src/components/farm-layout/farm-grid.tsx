"use client";

import { useState, useEffect } from "react";
import { Sprout, Tractor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Plant {
  name: string;
  description: string;
  type: string;
  color: string;
}

const colorOptions = [
  "#34D399", // emerald
  "#FBBF24", // amber
  "#60A5FA", // blue
  "#F87171", // red
  "#A78BFA", // violet
  "#F472B6", // pink
];

export function FarmGrid() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(12);
  const [grid, setGrid] = useState<(Plant | null)[][]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [plantName, setPlantName] = useState("Heirloom Tomato");
  const [plantDescription, setPlantDescription] = useState("Rich, full-flavored tomatoes perfect for salads and sauces.");
  const [plantType, setPlantType] = useState("Vegetable");
  const [plantColor, setPlantColor] = useState(colorOptions[0]);

  useEffect(() => {
    setIsMounted(true);
    setGrid(Array(8).fill(null).map(() => Array(12).fill(null)));
  }, []);

  const handleGridChange = (type: "rows" | "cols", value: number) => {
    let newGrid;
    if (type === "rows") {
      setRows(value);
      newGrid = Array(value).fill(null).map((_, r) => grid[r] || Array(cols).fill(null));
    } else {
      setCols(value);
      newGrid = grid.map(row => {
        const newRow = [...row];
        while (newRow.length < value) newRow.push(null);
        return newRow.slice(0, value);
      });
    }
    setGrid(newGrid);
  };

  const toggleCell = (r: number, c: number) => {
    const newGrid = grid.map(row => [...row]);
    if (newGrid[r][c]) {
      newGrid[r][c] = null;
    } else {
      if (plantName && plantDescription && plantType) {
        newGrid[r][c] = {
          name: plantName,
          description: plantDescription,
          type: plantType,
          color: plantColor,
        };
      }
    }
    setGrid(newGrid);
  };
  
  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4 overflow-auto">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                  <Tooltip key={`${rIdx}-${cIdx}`}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleCell(rIdx, cIdx)}
                        className={cn(
                          "aspect-square rounded-md border flex items-center justify-center transition-colors",
                          cell ? "border-solid" : "border-dashed hover:bg-accent/50"
                        )}
                        style={cell ? { backgroundColor: `${cell.color}33`, borderColor: cell.color } : {}}
                        aria-label={`Plot ${rIdx + 1}, ${cIdx + 1}`}
                      >
                        {cell && <Sprout className="w-4 h-4" style={{ color: cell.color }} />}
                      </button>
                    </TooltipTrigger>
                    {cell && (
                      <TooltipContent>
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">{cell.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cell.description}
                          </p>
                          <div className="flex items-center pt-2">
                            <span className="text-xs text-muted-foreground">Type: {cell.type}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Layout Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg bg-card">
              <h3 className="font-semibold text-lg">Current Plant</h3>
              <div>
                <Label htmlFor="plant-name">Plant Name</Label>
                <Input id="plant-name" value={plantName} onChange={(e) => setPlantName(e.target.value)} placeholder="e.g., Cherry Tomato" />
              </div>
              <div>
                <Label htmlFor="plant-type">Plant Type</Label>
                <Select value={plantType} onValueChange={setPlantType}>
                  <SelectTrigger id="plant-type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Fruit">Fruit</SelectItem>
                    <SelectItem value="Herb">Herb</SelectItem>
                    <SelectItem value="Flower">Flower</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plant Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setPlantColor(color)}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-transform",
                        plantColor === color ? "border-primary scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="plant-description">Description</Label>
                <Textarea id="plant-description" value={plantDescription} onChange={(e) => setPlantDescription(e.target.value)} placeholder="Describe the plant..." />
              </div>
            </div>

            <div>
              <Label htmlFor="rows-slider">Rows: {rows}</Label>
              <Slider
                id="rows-slider"
                min={4}
                max={20}
                step={1}
                value={[rows]}
                onValueChange={(val) => handleGridChange("rows", val[0])}
              />
            </div>
            <div>
              <Label htmlFor="cols-slider">Columns: {cols}</Label>
              <Slider
                id="cols-slider"
                min={4}
                max={20}
                step={1}
                value={[cols]}
                onValueChange={(val) => handleGridChange("cols", val[0])}
              />
            </div>
            <div className="text-sm text-muted-foreground pt-4 border-t">
              <Tractor className="inline-block mr-2 w-4 h-4" />
              Total plots: {rows * cols}. Planted: {grid.flat().filter(c => c !== null).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
