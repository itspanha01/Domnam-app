"use client";

import { useState, useEffect } from "react";
import { Sprout, Tractor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function FarmGrid() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(12);
  const [grid, setGrid] = useState<number[][]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setGrid(Array(8).fill(0).map(() => Array(12).fill(0)));
  }, []);

  const handleGridChange = (type: "rows" | "cols", value: number) => {
    let newGrid;
    if (type === "rows") {
      setRows(value);
      newGrid = Array(value).fill(0).map((_, r) => grid[r] || Array(cols).fill(0));
    } else {
      setCols(value);
      newGrid = grid.map(row => {
        const newRow = [...row];
        while (newRow.length < value) newRow.push(0);
        return newRow.slice(0, value);
      });
    }
    setGrid(newGrid);
  };

  const toggleCell = (r: number, c: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
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
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => toggleCell(rIdx, cIdx)}
                    className={cn(
                      "aspect-square rounded-md border border-dashed flex items-center justify-center transition-colors",
                      cell === 1 ? "bg-primary/20 border-primary" : "hover:bg-accent/50"
                    )}
                    aria-label={`Plot ${rIdx + 1}, ${cIdx + 1}`}
                  >
                    {cell === 1 && <Sprout className="w-4 h-4 text-primary" />}
                  </button>
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
              Total plots: {rows * cols}. Planted: {grid.flat().filter(c => c === 1).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
