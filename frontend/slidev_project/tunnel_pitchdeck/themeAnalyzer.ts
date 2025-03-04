import { ThemeConfig } from './themeConfig.js';
import { GoogleGenerativeAI } from '@google/generative-ai';


export async function determineTheme(screenplaySynopsis: string, ai: GoogleGenerativeAI): Promise<ThemeConfig> {
    const prompt = `
    Analyze the following screenplay synopsis and suggest a theme configuration for the Film/production pitch deck.
    Provide specific colors and fonts that would best represent the theme of the story. Make sure the colors are contrasting such that the text is readable.
    Return the theme in a JSON format with the following structure: nothing else.
    {
      "colors": {
        "primary": "string",
        "secondary": "string",
        "text": "string",
        "background": "string"
      },
      "font": {
        "family": "string",
        "size": "string",
        "weight": "string"
      }
    }
    Synopsis: ${screenplaySynopsis}
    `;
    const model = ai.getGenerativeModel({model: 'gemini-1.5-flash'});

    const result = await model.generateContent(prompt);
    console.log("This is the Gemini Generated Response: ", result.response.text().replace(/```json|```/g, ''));
    const theme: ThemeConfig = JSON.parse(result.response.text().replace(/```json|```/g, ''));
    return theme;
};


////////////////////////////////////////////////////////////
// Determining Look Book Palette
////////////////////////////////////////////////////////////

export async function determineLookBookPalette(coverageReport: any, ai: GoogleGenerativeAI) : Promise<{palette: string[], description: string}> {
    const prompt = `
    Analyze the following screenplay coverage report and generate a color palette for a look book that captures the film's visual tone.
    Consider the themes, mood, and setting detailed in the report.
    Return a JSON object with two properties:
    "palette": an array of 4 to 6 hex color codes (each starting with "#")
    "description": a short sentence describing the overall visual tone of the film.
    Coverage Report:
    ${JSON.stringify(coverageReport, null, 2)}
    `;
    
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash'});
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, '');

    try {
        const output = JSON.parse(responseText);
        return output;
    } catch (error) {
        console.error("Error parsing look book palette:", error);
        // some random hex codes for default
        return {
            palette: ['#2C3E50', '#7F8C8D', '#3498DB', '#E74C3C', '#9B59B6', '#F1C40F'],
            description: "A visually striking and emotionally intense film with a mix of dark and vibrant colors."
        };
    }
}


