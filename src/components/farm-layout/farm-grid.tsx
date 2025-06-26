"use client";

import { useState, useEffect } from "react";
import { Sprout, Tractor, Undo, Redo, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
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

  // Undo/Redo state
  const [history, setHistory] = useState<(Plant | null)[][][]>([
    Array(8).fill(null).map(() => Array(12).fill(null))
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const grid = history[historyIndex];

  const [isMounted, setIsMounted] = useState(false);
  
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [cellToDelete, setCellToDelete] = useState<{ r: number; c: number } | null>(null);

  const [plantName, setPlantName] = useState("Heirloom Tomato");
  const [plantDescription, setPlantDescription] = useState("Rich, full-flavored tomatoes perfect for salads and sauces.");
  const [plantType, setPlantType] = useState("Vegetable");
  const [plantColor, setPlantColor] = useState(colorOptions[0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateGrid = (newGrid: (Plant | null)[][]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newGrid]);
    setHistoryIndex(newHistory.length);
  };

  const handleGridChange = (type: "rows" | "cols", value: number) => {
    let newRows = type === "rows" ? value : rows;
    let newCols = type === "cols" ? value : cols;
    
    const newGrid = Array(newRows).fill(null).map((_, r) => 
        Array(newCols).fill(null).map((_, c) => {
            if (grid && grid[r] && grid[r][c]) {
                return grid[r][c];
            }
            return null;
        })
    );

    if (type === "rows") {
      setRows(value);
    } else {
      setCols(value);
    }
    
    setHistory([newGrid]);
    setHistoryIndex(0);
  };

  const handleCellClick = (r: number, c: number) => {
    const newGrid = grid.map(row => [...row]);
    
    if (mode === 'add') {
      if (newGrid[r][c] === null && plantName && plantDescription && plantType) {
        newGrid[r][c] = {
          name: plantName,
          description: plantDescription,
          type: plantType,
          color: plantColor,
        };
        updateGrid(newGrid);
      }
    } else if (mode === 'remove') {
      if (newGrid[r][c]) {
        setCellToDelete({ r, c });
      }
    }
  };
  
  const handleConfirmDelete = () => {
    if (!cellToDelete) return;
    const { r, c } = cellToDelete;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = null;
    updateGrid(newGrid);
    setCellToDelete(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <TooltipProvider>
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
                    <Tooltip key={`${rIdx}-${cIdx}`} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCellClick(rIdx, cIdx)}
                          className={cn(
                            "aspect-square rounded-md border flex items-center justify-center transition-all",
                            cell ? "border-solid" : "border-dashed",
                            mode === 'add' && !cell && "hover:bg-accent/50 cursor-pointer",
                            mode === 'remove' && cell && "hover:bg-destructive/20 hover:border-destructive cursor-pointer",
                            mode === 'remove' && !cell && "cursor-not-allowed",
                            mode === 'add' && cell && "cursor-not-allowed",
                          )}
                          style={cell ? { backgroundColor: `${cell.color}33`, borderColor: cell.color } : {}}
                          aria-label={`Plot ${rIdx + 1}, ${cIdx + 1}`}
                        >
                          {cell && <Sprout className="w-4 h-4" style={{ color: cell.color }} />}
                        </button>
                      </TooltipTrigger>
                      {cell && (
                        <TooltipContent>
                          <div className="space-y-1">
                            <h4 className="font-medium leading-none">{cell.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {cell.description}
                            </p>
                            <div className="flex items-center pt-1">
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
              <div className="space-y-4">
                  <div className="space-y-2">
                      <Label>Editor Mode</Label>
                      <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'add'|'remove')} className="grid grid-cols-2 gap-2">
                          <Label htmlFor="mode-add" className={cn("flex items-center justify-center gap-2 p-3 border rounded-md cursor-pointer transition-colors", mode === 'add' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent/50')}>
                              <Sprout className="h-4 w-4" /> Add
                              <RadioGroupItem value="add" id="mode-add" className="sr-only" />
                          </Label>
                          <Label htmlFor="mode-remove" className={cn("flex items-center justify-center gap-2 p-3 border rounded-md cursor-pointer transition-colors", mode === 'remove' ? 'bg-destructive text-destructive-foreground border-destructive' : 'hover:bg-accent/50')}>
                              <Trash2 className="h-4 w-4" /> Remove
                              <RadioGroupItem value="remove" id="mode-remove" className="sr-only" />
                          </Label>
                      </RadioGroup>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={handleUndo} disabled={historyIndex === 0} className="w-full">
                          <Undo className="mr-2 h-4 w-4" />
                          Undo
                      </Button>
                      <Button variant="outline" onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="w-full">
                          <Redo className="mr-2 h-4 w-4" />
                          Redo
                      </Button>
                  </div>
              </div>

              <Separator />

              <div className={cn("space-y-4 transition-opacity", mode === 'remove' && 'opacity-50 pointer-events-none')}>
                <h3 className="font-semibold text-lg px-1">Current Plant</h3>
                <div className="space-y-4 p-4 border rounded-lg bg-card">
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
              </div>
              
              <Separator />

              <div className="space-y-4">
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
              </div>

              <div className="text-sm text-muted-foreground pt-4 border-t">
                <Tractor className="inline-block mr-2 w-4 h-4" />
                Total plots: {rows * cols}. Planted: {grid.flat().filter(c => c !== null).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={!!cellToDelete} onOpenChange={(open) => !open && setCellToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove the plant from this plot.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
