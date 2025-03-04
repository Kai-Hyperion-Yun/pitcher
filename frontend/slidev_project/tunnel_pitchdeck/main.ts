import fs from 'fs/promises'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import { loadConfig, initializeAI } from './config.js'
import { dirname } from 'path'
import { SlideGenerator } from './SlideGenerator.js'
import { ScreenplayData } from './models.js'



// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load configuration
const configFilePath = path.join(__dirname, '..', 'config.yaml');
const fileContents = await fs.readFile(configFilePath, 'utf-8');
const config = yaml.load(fileContents) as { google_api_key: string };


////////////////////////////////////////////////////////////
// Fetch Screenplay Data
////////////////////////////////////////////////////////////
async function fetchScreenplayData() {
  const jsonPath = path.join(__dirname, 'bad-ass-girls.json');
  const fileContents = await fs.readFile(jsonPath, 'utf-8');
  return JSON.parse(fileContents) as ScreenplayData;
}

async function main() {
  try {
    // Read screenplay JSON
    const jsonPath = path.join(__dirname, 'bad-ass-girls.json')
    const screenplayData = JSON.parse(
      await fs.readFile(jsonPath, 'utf-8')
    ) as ScreenplayData

    // Generate slides
    const slideGenerator = new SlideGenerator(screenplayData);
    const slidesContent = await slideGenerator.generateAllSlides();


    // Save to slides.md
    const outputPath = path.join(__dirname, '..', '..', 'public','slides.md');

    try {
      await fs.writeFile(outputPath, slidesContent);
      console.log('Slides generated successfully!');
    } catch (writeError) {
      console.error('Error writing slides.md:', writeError);
    }

  } catch (error) {
    console.error('Error:', error)
  }


  // This is test to generate an image
  // try {
  //   const image = await generateImage('A beautiful landscape with a river and mountains');
  //   console.log('Generated Image:', image);
  // } catch (error) {
  //   console.error('Error:', error);
  // }


  // This is test to fetch images from TMDB

}

main() 