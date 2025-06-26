import { FarmGrid } from "@/components/farm-layout/farm-grid";

export default function FarmLayoutPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-headline font-bold">Farm Layout Designer</h1>
        <p className="text-muted-foreground">
          Plan your farm layout by adjusting the grid and clicking on cells to toggle plants.
        </p>
      </div>
      <FarmGrid />
    </div>
  );
}
