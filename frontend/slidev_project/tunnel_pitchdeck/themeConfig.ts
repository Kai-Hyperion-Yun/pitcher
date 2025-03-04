import { reactive, watch } from 'vue';
import { determineTheme } from './themeAnalyzer.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ThemeColors {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  }
  
  export interface ThemeFont {
    family: string;
    size: string;
    weight: string;
  }
  
  export interface ThemeConfig {
    colors: ThemeColors;
    font: ThemeFont;
  }
  
  export const themeConfig = reactive<ThemeConfig>({
    colors: {
      primary: '#333333',
      secondary: '#555555',
      text: '#FFFFFF',
      background: '#000000',
    },
    font: {
      family: 'Arial, sans-serif',
      size: '16px',
      weight: 'normal',
    }
  });

// Function to update theme using AI
export async function updateThemeUsingAI(screenplaySynopsis: string, ai: GoogleGenerativeAI) {
  const newTheme = await determineTheme(screenplaySynopsis, ai);
  Object.assign(themeConfig, newTheme);
}

// Watch for changes and update CSS variables
// What I leanred. Vue's watch function is reactive.
// It will watch the themeConfig object and update the CSS variable when the object changes.
if (typeof document !== 'undefined') {
  watch(themeConfig, (newTheme) => {
    document.documentElement.style.setProperty('--theme-primary', newTheme.colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', newTheme.colors.secondary);
    document.documentElement.style.setProperty('--theme-text', newTheme.colors.text);
    document.documentElement.style.setProperty('--theme-background', newTheme.colors.background);
    document.documentElement.style.setProperty('--theme-font-family', newTheme.font.family);
    document.documentElement.style.setProperty('--theme-font-size', newTheme.font.size);
    document.documentElement.style.setProperty('--theme-font-weight', newTheme.font.weight);
  }, { deep: true });
}
// deep: true is used to watch the nested properties of the themeConfig objects.