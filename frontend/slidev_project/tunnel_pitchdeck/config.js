import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();
// Constants for file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Function to load configs from a YAML file
export async function loadConfig(configFilePath) {
    try {
        const fileContents = await fs.readFile(configFilePath, 'utf-8');
        const config = yaml.load(fileContents);
        if (!config.google_api_key) {
            throw new Error("Google API key is missing in the config");
        }
        return config;
    }
    catch (error) {
        console.error(`Failed to load config from ${configFilePath}:`, error);
        throw error;
    }
}
// Function to Initialize Google Generative AI with the provided API key
export function initializeAI(apiKey) {
    if (!apiKey) {
        throw new Error("Google API key is required to initialize Google GenAI");
    }
    return new GoogleGenerativeAI(apiKey);
}
module.exports = { loadConfig, initializeAI };
