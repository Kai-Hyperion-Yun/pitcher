interface ScreenplayMood {
    mood: 'dramatic' | 'lighthearted' | 'thriller'
    colorScheme: {
      primary: string
      secondary: string
      accent: string
      background: string
    }
  }
  
  export function analyzeScreenplay(screenplay: string): ScreenplayMood {
    // This is a simple example - you could make this more sophisticated
    // by using NLP or other analysis techniques
    const keywords = {
      dramatic: ['tragedy', 'drama', 'serious', 'emotional'],
      lighthearted: ['comedy', 'fun', 'light', 'happy'],
      thriller: ['mystery', 'suspense', 'dark', 'tension']
    }
  
    let moodScores = {
      dramatic: 0,
      lighthearted: 0,
      thriller: 0
    }
  
    // Count keyword occurrences
    Object.entries(keywords).forEach(([mood, words]) => {
      words.forEach(word => {
        const regex = new RegExp(word, 'gi')
        const count = (screenplay.match(regex) || []).length
        moodScores[mood] += count
      })
    })
  
    // Determine dominant mood
    const dominantMood = Object.entries(moodScores)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'dramatic' | 'lighthearted' | 'thriller'
  
    // Return appropriate theme settings
    const moodSettings: Record<string, ScreenplayMood> = {
      dramatic: {
        mood: 'dramatic',
        colorScheme: {
          primary: '#2B2B2B',
          secondary: '#6B6B6B',
          accent: '#8B0000',
          background: '#FFFFFF'
        }
      },
      lighthearted: {
        mood: 'lighthearted',
        colorScheme: {
          primary: '#2D5A27',
          secondary: '#4A90E2',
          accent: '#FF6B6B',
          background: '#F9F9F9'
        }
      },
      thriller: {
        mood: 'thriller',
        colorScheme: {
          primary: '#1A1A1A',
          secondary: '#404040',
          accent: '#DC143C',
          background: '#F5F5F5'
        }
      }
    }
  
    return moodSettings[dominantMood]
  }