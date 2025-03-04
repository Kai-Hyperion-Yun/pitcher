
import { analyzeScreenplay } from './utils/themeAnalyzer'

// Directly export the configuration object
export default {
  name: 'screenplay-theme',
  themeName: 'Screenplay Theme',
  
  // Define theme variables that can be modified based on screenplay mood
  colors: {
    primary: '#2B2B2B',
    secondary: '#6B6B6B',
    accent: '#E63946',
    background: '#FFFFFF',
  },
  
  // Define different font combinations for different moods
  fonts: {
    // For serious, dramatic screenplays
    dramatic: {
      sans: 'Playfair Display',
      serif: 'Merriweather',
      mono: 'Fira Code',
    },
    // For light-hearted screenplays
    lighthearted: {
      sans: 'Poppins',
      serif: 'Lora',
      mono: 'Source Code Pro',
    },
    // For thriller/mystery screenplays
    thriller: {
      sans: 'Oswald',
      serif: 'Crimson Text',
      mono: 'IBM Plex Mono',
    }
  }
}