import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { Plant } from '@/components/farm-layout/farm-grid';

export async function saveFarmLayout(userId: string, grid: (Plant | null)[][], rows: number, cols: number) {
    if (!userId) throw new Error("User not authenticated");

    const gridToSave: Record<string, Record<string, Plant | null>> = {};
    grid.forEach((row, rIdx) => {
        const rowData: Record<string, Plant | null> = {};
        row.forEach((cell, cIdx) => {
            rowData[cIdx.toString()] = cell;
        });
        gridToSave[rIdx.toString()] = rowData;
    });

    const docRef = doc(db, 'farmLayouts', userId);
    await setDoc(docRef, { grid: gridToSave, rows, cols, savedAt: new Date() });
}

export async function getFarmLayout(userId: string): Promise<{grid: (Plant | null)[][], rows: number, cols: number} | null> {
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'farmLayouts', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const { rows, cols, grid: savedGrid } = data;

        if (!rows || !cols || !savedGrid) {
            return null;
        }

        const grid: (Plant | null)[][] = Array(rows).fill(null).map(() => Array(cols).fill(null));
        
        Object.keys(savedGrid).forEach(rIdxStr => {
            const rIdx = parseInt(rIdxStr, 10);
            if (rIdx < rows && savedGrid[rIdxStr]) {
                Object.keys(savedGrid[rIdxStr]).forEach(cIdxStr => {
                    const cIdx = parseInt(cIdxStr, 10);
                    if (cIdx < cols) {
                        grid[rIdx][cIdx] = savedGrid[rIdxStr][cIdxStr];
                    }
                });
            }
        });

        return {
            grid,
            rows,
            cols,
        };
    }
    return null;
}
