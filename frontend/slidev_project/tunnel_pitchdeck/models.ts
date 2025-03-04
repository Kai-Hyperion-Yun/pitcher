export interface SlideConfig {
    name: string // name of the lside (title, logline ,etc)
    prompt: string // the proompt to send to gemini
}
  
export interface CharacterBreakdown {
    name: string
    type: string
    description: string
    age_range: string
    comps: string[]
    gender: string
    ethnicity: string
    image?: string
}

export interface CrewDetails {
    name: string
    id: number
    role: string
    image: string
}

export interface Comparable {
    title: string
    base64Image: string
    budget: string
    revenue: string
}

export interface ScreenplayData {
    title: string
    writer: string
    coverage_report: {
        logline: string
        production_scheme: {
            genre: string
        }
        character_breakdowns: CharacterBreakdown[]
        analysis: {
            comps: string[]
        }
        comprehensive_synopsis: string
    }
}
  
