
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Trash2, Edit } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const YIELD_DATA_STORAGE_KEY = 'domnam-yield-data';

export interface YieldEntry {
  id: string;
  crop: string;
  yield: number;
  harvestDate: Date;
  notes?: string;
}

const formSchema = z.object({
  crop: z.string().min(2, "Crop name must be at least 2 characters."),
  yield: z.coerce.number().min(0.1, "Yield must be a positive number."),
  harvestDate: z.date({
    required_error: "A harvest date is required.",
  }),
  notes: z.string().optional(),
});

export default function YieldTrackerPage() {
  const { t } = useLanguage();
  const [yieldData, setYieldData] = useState<YieldEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<YieldEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<YieldEntry | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedData = localStorage.getItem(YIELD_DATA_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData).map((entry: any) => ({
          ...entry,
          harvestDate: new Date(entry.harvestDate),
        }));
        setYieldData(parsedData);
      }
    } catch (error) {
      console.error("Failed to parse yield data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(YIELD_DATA_STORAGE_KEY, JSON.stringify(yieldData));
    }
  }, [yieldData, isMounted]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (entryToEdit) {
      form.reset({
        crop: entryToEdit.crop,
        yield: entryToEdit.yield,
        harvestDate: entryToEdit.harvestDate,
        notes: entryToEdit.notes || "",
      });
    } else {
      form.reset({
        crop: "",
        yield: undefined,
        harvestDate: new Date(),
        notes: "",
      });
    }
  }, [entryToEdit, form]);

  const handleOpenDialog = (entry: YieldEntry | null = null) => {
    setEntryToEdit(entry);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEntryToEdit(null);
    form.reset();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (entryToEdit) {
      // Update existing entry
      setYieldData(
        yieldData.map((entry) =>
          entry.id === entryToEdit.id ? { ...entry, ...values } : entry
        )
      );
    } else {
      // Add new entry
      const newEntry: YieldEntry = {
        id: crypto.randomUUID(),
        ...values,
      };
      setYieldData([newEntry, ...yieldData]);
    }
    handleCloseDialog();
  };
  
  const handleDeleteRequest = (entry: YieldEntry) => {
    setEntryToDelete(entry);
  };
  
  const handleConfirmDelete = () => {
    if(entryToDelete) {
        setYieldData(yieldData.filter(entry => entry.id !== entryToDelete.id));
        setEntryToDelete(null);
    }
  };

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('yield_tracker_title')}</h1>
          <p className="text-muted-foreground">{t('yield_tracker_description')}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => open ? handleOpenDialog() : handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> {t('add_yield_entry_button')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('add_or_edit_yield_entry_dialog_title')}</DialogTitle>
              <DialogDescription>{t('add_or_edit_yield_entry_dialog_description')}</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="crop" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('crop_name_label')}</FormLabel>
                    <FormControl><Input placeholder={t('crop_name_placeholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="yield" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('yield_amount_label')}</FormLabel>
                    <FormControl><Input type="number" placeholder={t('yield_amount_placeholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="harvestDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('harvest_date_label')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>{t('pick_a_date')}</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('notes_label')} <span className="text-muted-foreground">{t('notes_optional')}</span></FormLabel>
                    <FormControl><Textarea placeholder={t('notes_placeholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                 <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>{t('cancel_button')}</Button>
                    <Button type="submit">{entryToEdit ? t('update_entry_button') : t('add_entry_button')}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table_header_crop')}</TableHead>
              <TableHead className="text-right">{t('table_header_yield')}</TableHead>
              <TableHead>{t('table_header_date')}</TableHead>
              <TableHead>{t('table_header_actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {yieldData.length > 0 ? (
              yieldData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.crop}</TableCell>
                  <TableCell className="text-right">{entry.yield} kg</TableCell>
                  <TableCell>{format(entry.harvestDate, "PPP")}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                     <Button variant="destructive" size="icon" onClick={() => handleDeleteRequest(entry)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t('no_yield_data_title')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>{t('delete_entry_confirmation_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('delete_entry_confirmation_description', { cropName: entryToDelete?.crop || '' })}
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setEntryToDelete(null)}>{t('cancel_button')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('delete_button')}</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}
