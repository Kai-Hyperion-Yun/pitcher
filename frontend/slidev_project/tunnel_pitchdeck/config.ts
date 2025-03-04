import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load .env file for local development
dotenv.config();

export async function loadConfig() {
  try {
    // First try to load from environment variables
    const config = {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      TMDB_API_READ_ACCESS_TOKEN: process.env.TMDB_API_READ_ACCESS_TOKEN,
      GETIMG_API_KEY: process.env.GETIMG_API_KEY,
      UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
      UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
      PEXELS_API_KEY: process.env.PEXELS_API_KEY,
      // Add any other keys you need
    };

    // For local development, fall back to config.yaml if environment variables aren't set
    // if (!config.GOOGLE_API_KEY) {
    //   try {
    //     const __filename = fileURLToPath(import.meta.url);
    //     const __dirname = dirname(__filename);
    //     const configPath = path.join(__dirname, 'config.yaml');
    //     const fileContents = await fs.readFile(configPath, 'utf-8');
    //     const yamlConfig = yaml.load(fileContents) as Record<string, string>;
        
    //     // Merge with priority to environment variables
    //     Object.keys(yamlConfig).forEach(key => {
    //       if (!config[key]) {
    //         config[key] = yamlConfig[key];
    //       }
    //     });
    //   } catch (error) {
    //     console.warn('Could not load config.yaml, using only environment variables');
    //   }
    // }

    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}

export function initializeAI(apiKey?: string) {
  const key = apiKey || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error('Google API key is required');
  }
  return new GoogleGenerativeAI(key);
}

