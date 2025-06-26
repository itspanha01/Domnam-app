// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Provides AI-powered plant care recommendations based on weather conditions and plant data.
 *
 * - getPlantCareTips - A function to retrieve plant care tips.
 * - PlantCareTipsInput - The input type for the getPlantCareTips function.
 * - PlantCareTipsOutput - The return type for the getPlantCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlantCareTipsInputSchema = z.object({
  weatherConditions: z
    .string()
    .describe('The current weather conditions (e.g., sunny, rainy, cloudy).'),
  plantType: z.string().describe('The type of plant (e.g., tomato, rose, lettuce).'),
  plantHealth: z.string().describe('The current health status of the plant (e.g. healthy, diseased).'),
  humidity: z.number().describe('The current humidity level (in percentage).'),
  temperature: z.number().describe('The current temperature in Celsius.'),
});
export type PlantCareTipsInput = z.infer<typeof PlantCareTipsInputSchema>;

const PlantCareTipsOutputSchema = z.object({
  careTips: z.string().describe('AI-powered recommendations for plant care.'),
});
export type PlantCareTipsOutput = z.infer<typeof PlantCareTipsOutputSchema>;

export async function getPlantCareTips(input: PlantCareTipsInput): Promise<PlantCareTipsOutput> {
  return getPlantCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'plantCareTipsPrompt',
  input: {schema: PlantCareTipsInputSchema},
  output: {schema: PlantCareTipsOutputSchema},
  prompt: `You are an AI assistant specializing in providing plant care tips. Based on the current weather conditions, plant type, plant health, humidity, and temperature, provide specific recommendations for how to care for the plant.

Weather Conditions: {{{weatherConditions}}}
Plant Type: {{{plantType}}}
Plant Health: {{{plantHealth}}}
Humidity: {{{humidity}}}%
Temperature: {{{temperature}}}°C

Care Tips:`,
});

const getPlantCareTipsFlow = ai.defineFlow(
  {
    name: 'getPlantCareTipsFlow',
    inputSchema: PlantCareTipsInputSchema,
    outputSchema: PlantCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
