import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeAI } from './config.js';
import { slideConfigs } from './slideConfigs.js';
import { dirname } from 'path';
// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load configuration
const config = require(path.join(__dirname, 'config.yaml'));
// Initialize AI
const genAI = initializeAI(config.google_api_key);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
class SlideGenerator {
    constructor(screenplayData) {
        this.screenplayData = screenplayData;
    }
    async generateSlide(config) {
        // Directly format the prompt without using AI
        const formattedContent = this.formatPrompt(config.prompt);
        return formattedContent.trim();
    }
    formatPrompt(prompt) {
        return prompt.replace(/{{(\w+)}}/g, (match, key) => {
            switch (key) {
                case 'title_data':
                    return JSON.stringify({
                        title: "Bad Ass Girls",
                        writer: this.screenplayData?.writer || 'Unknown Writer',
                        backgroundImage: "https://cover.sli.dev"
                    }, null, 2);
                case 'logline_data':
                    return JSON.stringify({
                        logline: this.screenplayData?.coverage_report?.logline || 'Logline not available',
                        genre: this.screenplayData?.coverage_report?.production_scheme?.genre || 'Genre not specified',
                        image: "/logline_images/logline_bad-ass-girls.jpeg"
                    }, null, 2);
                case 'miranda_kent_details':
                    const mirandaData = this.screenplayData.coverage_report.character_breakdowns
                        .find(char => char.name === "Miranda Kent");
                    if (!mirandaData) {
                        console.warn('Miranda Kent character data not found');
                        return JSON.stringify({
                            name: 'Miranda Kent',
                            type: 'lead',
                            comps: [],
                            gender: '',
                            age_range: '',
                            ethnicity: '',
                            description: 'Character data not found'
                        }, null, 2);
                    }
                    return JSON.stringify({
                        name: mirandaData.name,
                        type: mirandaData.type,
                        comps: mirandaData.comps,
                        gender: mirandaData.gender,
                        age_range: mirandaData.age_range,
                        ethnicity: mirandaData.ethnicity,
                        description: mirandaData.description
                    }, null, 2);
                case 'lead_characters':
                    const leadCharacters = this.screenplayData?.coverage_report?.character_breakdowns
                        ?.filter(char => char.type === 'lead') || [];
                    return JSON.stringify(leadCharacters, null, 2);
                default:
                    return match;
            }
        });
    }
    async generateAllSlides() {
        const slides = [];
        for (const config of slideConfigs) {
            try {
                const slideContent = await this.generateSlide(config);
                if (slideContent) {
                    slides.push(slideContent.trim());
                    console.log(`✓ Generated ${config.name} slide`);
                }
            }
            catch (error) {
                console.error(`× Failed to generate ${config.name} slide:`, error);
            }
        }
        // Join slides with a single separator
        return slides.join('\n');
    }
}
async function main() {
    try {
        // Read screenplay JSON
        const jsonPath = path.join(__dirname, 'bad-ass-girls.json');
        const screenplayData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        // Generate slides
        const generator = new SlideGenerator(screenplayData);
        const slidesContent = await generator.generateAllSlides();
        // Save to slides.md
        const outputPath = path.join(__dirname, 'slides.md');
        await fs.writeFile(outputPath, slidesContent);
        console.log('Slides generated successfully!');
    }
    catch (error) {
        console.error('Error:', error);
    }
}
main();
