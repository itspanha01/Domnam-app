"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { getPlantCareTips } from "@/ai/flows/get-plant-care-tips"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Wand2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"

const formSchema = z.object({
  weatherConditions: z.string().min(1, "Please select weather conditions."),
  plantType: z.string().min(2, "Plant type must be at least 2 characters."),
  plantHealth: z.string().min(1, "Please select plant health."),
  humidity: z.number().min(0).max(100),
  temperature: z.number().min(-50).max(50),
})

export function AiTipAdvisor() {
  const [isLoading, setIsLoading] = useState(false)
  const [tip, setTip] = useState("")
  const { toast } = useToast()
  const { t } = useLanguage()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weatherConditions: "sunny",
      plantType: "Tomato",
      plantHealth: "healthy",
      humidity: 65,
      temperature: 28,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setTip("")
    try {
      const result = await getPlantCareTips(values)
      setTip(result.careTips)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: t('error_generating_tip_title'),
        description: t('error_generating_tip_description'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="text-primary" />
          {t('ai_advisor_title')}
        </CardTitle>
        <CardDescription>{t('ai_advisor_description')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="plantType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('plant_type_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('plant_type_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weatherConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('weather_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder={t('select_weather')} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sunny">{t('weather_sunny')}</SelectItem>
                      <SelectItem value="rainy">{t('weather_rainy')}</SelectItem>
                      <SelectItem value="cloudy">{t('weather_cloudy')}</SelectItem>
                      <SelectItem value="windy">{t('weather_windy')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantHealth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('plant_health_label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder={t('select_health')} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="healthy">{t('health_healthy_option')}</SelectItem>
                      <SelectItem value="wilting">{t('health_wilting')}</SelectItem>
                      <SelectItem value="diseased">{t('health_diseased')}</SelectItem>
                      <SelectItem value="pests">{t('health_pests')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('temperature_label', {temp: field.value.toString()})}</FormLabel>
                  <FormControl>
                    <Slider
                      min={-10}
                      max={40}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="humidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('humidity_label', {humidity: field.value.toString()})}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('generating_button')}
                </>
              ) : (
                t('get_care_tip_button')
              )}
            </Button>
            {tip && (
              <Card className="bg-primary/10 border-primary/50">
                <CardContent className="p-4 text-sm">
                  <p>{tip}</p>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
