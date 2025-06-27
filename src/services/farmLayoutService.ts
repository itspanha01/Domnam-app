import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import type { Plant } from '@/components/farm-layout/farm-grid';

export async function saveFarmLayout(userId: string, grid: (Plant | null)[][], rows: number, cols: number) {
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'farmLayouts', userId);
    await setDoc(docRef, { grid, rows, cols, savedAt: new Date() });
}

export async function getFarmLayout(userId: string): Promise<{grid: (Plant | null)[][], rows: number, cols: number} | null> {
    if (!userId) throw new Error("User not authenticated");
    const docRef = doc(db, 'farmLayouts', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            grid: data.grid,
            rows: data.rows,
            cols: data.cols,
        };
    }
    return null;
}
