// import { SlideConfig } from './models.ts'

interface SlideConfig {
  name: string // name of the lside (title, logline ,etc)
  prompt: string // the proompt to send to gemini
}
// interface Comparable {
//   title: string
//   base64Image: string
//   boxOffice: string
// }
// const comparables: Comparable[] = [
//   {
//       title: "Kill Bill",
//       imagePath: "/comp_posters/Kill Bill.jpg",
//       boxOffice: "$180M"
//   },
//   {
//       title: "Faster Pussycat! Kill! Kill!",
//       imagePath: "/comp_posters/Faster Pussycat! Kill! Kill!.jpg",
//       boxOffice: "$230M"
//   },
//   {
//       title: "Sin City",
//       imagePath: "/comp_posters/Sin City.jpg",
//       boxOffice: "$158M"
//   },
//   {
//       title: "Machete",
//       imagePath: "/comp_posters/Machete.jpg",
//       boxOffice: "$100M"
//   },
//   {
//       title: "Bitch Slap",
//       imagePath: "/comp_posters/Bitch Slap.jpg",
//       boxOffice: "$100M"
//   }
// ]
export const slideConfigs: SlideConfig[] = [
  {
    name: 'title',
    prompt: `
---
layout: default
class: text-center
aspectRatio: 16/9
---

<script setup>
import TitleSlide from './components/TitleSlide.vue'

const titleData = {{title_data}}
</script>

<TitleSlide :title-data="titleData" />`
  },
  {
    name: 'logline',
    prompt: `---
layout: default
---

<script setup>
import LoglineSlide from './components/LoglineSlide.vue'

const loglineData = {{logline_data}}
</script>

<LoglineSlide :logline-data="loglineData" />`
  },
  {
    name: 'comparables',
    prompt: `
---
layout: default
class: text-center
---

# Comparable Films

<script setup>
import ComparablesGrid from './components/ComparablesGrid.vue'
const comparables = {{comparables}}
</script>

<ComparablesGrid :comparables="comparables" />
    `
  },
  {
    name: 'crew',
    prompt: `
---
layout: default
---

# Cast & Crew

<script setup>
import CrewGrid from './components/CrewGrid.vue'
const crew = {{crew_details}}
</script>

<CrewGrid :crew="crew" />`
  },
//   {
//     name: 'lead_character',
//     prompt: `---
// layout: default
// ---

// <script setup>
// import LeadCharacterDetail from './components/LeadCharacterDetail.vue'

// const character = {{main_character_details}}
// </script>

// <LeadCharacterDetail :character="character" />`
//   },
//   {
//     name: 'lead_characters',
//     prompt: `---
// layout: default
// ---

// <script setup>
// import LeadCharactersGrid from './components/LeadCharactersGrid.vue'
// const characters = {{lead_characters}}
// </script>

// <LeadCharactersGrid :characters="characters" />`
//   },
  {
    name: 'style_frames',
    prompt: `
---
layout: default
---

# Visual Style

<script setup>
import StyleFrameGrid from './components/StyleFrameGrid.vue'
const frames = {{ style_frames_data }}
</script>

<StyleFrameGrid :frames="frames" />`
  },
  {
    name: 'look_book',
    prompt: `
---
layout: default
---


<script setup>
import LookBook from './components/LookBook.vue'
const section = {
  title: 'Look Book & Visual Tone',
  description: {{ look_book_description }},
  colorPalette: {{look_book_palette }},
  images: {{ look_book_images }}
}
</script>

<LookBook :section="section" />`
  },
  {
    name: 'budget',
    prompt: `
---
layout: default
---

# Budget Breakdown

<script setup>
import BudgetBreakdown from './components/BudgetBreakdown.vue'

const budgetData = {
  totalBudget: "4.5M",
  breakdowns: [
    {
      category: "Above the Line",
      amount: "1.2M",
      percentage: 27,
      items: [
        "Cast",
        "Director",
        "Producers",
        "Writers"
      ]
    },
    {
      category: "Production",
      amount: "2.1M",
      percentage: 47,
      items: [
        "Crew",
        "Equipment",
        "Locations",
        "Action Sequences",
        "Special Effects"
      ]
    },
    {
      category: "Post-Production",
      amount: "800K",
      percentage: 18,
      items: [
        "Editing",
        "Sound Design",
        "Visual Effects",
        "Color Grading",
        "Music"
      ]
    },
    {
      category: "Other",
      amount: "400K",
      percentage: 8,
      items: [
        "Insurance",
        "Legal",
        "Marketing",
        "Contingency"
      ]
    }
  ],
  notes: [
    "Tax incentives available in Los Angeles",
    "Potential co-production opportunities",
    "Action sequences budgeted for practical effects"
  ]
}
</script>

<BudgetBreakdown :budget-data="budgetData" />
`
  },
  {
    name: 'production_timeline',
    prompt: `---
layout: default
---

<script setup>
import ProductionTimeline from './components/ProductionTimeline.vue'

const timelineData = [
  { phase: 'Pre-Production', start: 'Jan 2024', end: 'Mar 2024' },
  { phase: 'Production', start: 'Apr 2024', end: 'Jun 2024' },
  { phase: 'Post-Production', start: 'Jul 2024', end: 'Sep 2024' },
  { phase: 'Release', start: 'Oct 2024', end: 'Dec 2024' }
]
</script>

<ProductionTimeline :timeline-data="timelineData" />`
  },
  {
    name: 'contact',
    prompt: `
---
layout: default
---

<script setup>
import ContactSlide from './components/ContactSlide.vue'
</script>

<ContactSlide />`
  }
  // Add more slide configs as needed
]