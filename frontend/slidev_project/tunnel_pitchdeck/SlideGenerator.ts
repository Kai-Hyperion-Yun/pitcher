import axios from 'axios';
import * as cheerio from 'cheerio';
import { CharacterBreakdown, Comparable, CrewDetails, ScreenplayData, SlideConfig } from './models.js'
import { updateThemeUsingAI } from './themeConfig.js';
import { themeConfig } from './themeConfig.js';
import { generateCharacterPrompt } from './promptGenerator.js';
import { slideConfigs } from './slideConfigs.js';
import { determineLookBookPalette } from './themeAnalyzer.js';
import { initializeAI, loadConfig } from './config.js';





////////////////////////////////////////////////////////////
// Update Theme Config
////////////////////////////////////////////////////////////
// async function updateThemeConfig(screenplayData: ScreenplayData) {
//   const config = await loadConfig();

//   const screenplaySynopsis = screenplayData.coverage_report.comprehensive_synopsis;
//   const newTheme = await determineTheme(screenplaySynopsis);
//   Object.assign(themeConfig, newTheme);
// }





////////////////////////////////////////////////////////////
// Fetch Main Character Image
////////////////////////////////////////////////////////////
async function fetchMainCharacterImage(mainCharacter: CharacterBreakdown) {
  const prompt = generateCharacterPrompt(mainCharacter);
  try {
    const response = await axios.post('http://localhost:3030/generate-image', { prompt });
    return `data:image/jpeg;base64,${response.data.image}`;
  } catch (error) {
    console.error('Error fetching main character image:', error);
    return 'https://cover.sli.dev';
  }
};







////////////////////////////////////////////////////////////
// Fetch Crew Details
////////////////////////////////////////////////////////////
async function fetchCrewDetails(names: string[], roles: string[]): Promise<CrewDetails[]> {
  const crewDetails= await Promise.all(names.map(async (name, index) => {
    try {
      const response = await axios.post('http://localhost:3030/fetch-person-details', {
        personName: name
      });
      return { name, role: roles[index], ...response.data};
    } catch (error) {
      console.error('Error fetching crew details:', error);
      return { name, id: 0, role: roles[index] || 'Unknown', image: 'N/A'};
    }
  }))
  return crewDetails;
}



////////////////////////////////////////////////////////////
// Fetch Comparables Details
////////////////////////////////////////////////////////////
async function fetchComparablesDetails(titles: string[]): Promise<Comparable[]> {
    try {
        const response = await axios.post('http://localhost:3030/fetch-comparable-details', {
            titles
        });
        const details = response.data;
        const res = Object.keys(details).map(title => {
            const formatValue = (value: number) => {
                if (isNaN(value) || value === 0) return 'N/A';
                return value >= 1e6 ? `$${(value / 1e6).toFixed(1)}M` : `$${value.toLocaleString()}`;
            };
            return {
                title: details[title].original_title,
                base64Image: details[title].image,
                budget: `Budget: ${formatValue(details[title].budget)}`,
                revenue: `Revenue: ${formatValue(details[title].revenue)}`
            };
        });
        return res;
    } catch (error) {
        console.error('Error fetching comparable details:', error);
        return [];
    }
};


////////////////////////////////////////////////////////////
// Generating Title Slide Background Image
////////////////////////////////////////////////////////////
// async function getDynamicTitleSlidePrompt(screenplayData: ScreenplayData, ai: any): Promise<string> {
//     const prompt = `
//     Analyze the following screenplay metadata and generate a prompt for creating a cinematic title slide background image.
//     The image should
//     `
async function generateTitleSlideBackground(screenplayData: ScreenplayData, ai: any): Promise<string> {
    const title = screenplayData.title || "Bad Ass Girlssss";
    const prompt = `
    Generate a cinematic title slide background image for the film pitch deck.
    The image should be visually striking with dramatic lighting and urban textures.
    It must be composed in a 16:9 aspect ratio.
    `

    try {
        // Calling image generation API
        const response = await axios.post('http://localhost:3030/generate-image', {
            model_name: 'flux-schnell',
            prompt: prompt
        });
        if (response.data && response.data.image) {
            console.log("Generated title slide background image:", response.data.image);
            return `data:image/jpeg;base64,${response.data.image}`;
        } else {
            console.error("No image data received from the API");
            return 'https://cover.sli.dev/';
        }
    } catch (error) {
        console.error('Error generating title slide background image:', error);
        return 'https://cover.sli.dev//';
    }
}



////////////////////////////////////////////////////////////
// Fetch Look Book Images
////////////////////////////////////////////////////////////
async function determineLookBookImageQuery(screenplayData: ScreenplayData, ai: any): Promise<string> {
    const prompt = `
    Analyze the following screenplay data and propose a concise search query that captures the film's unique visual tone, style, and mood.
    Generate a image search query (unsplash or pexels) that is suitable for finding look book stills for a film/production pitch deck. Return only the query, no other text.
    Screenplay's coverage report: ${JSON.stringify(screenplayData.coverage_report, null, 2)}
    `

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash'});
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();
    responseText = responseText.replace(/```/g, '').trim();
    return responseText;
}




// Helper to fetch Shot.caffe collections (genres, colors, and tags)
async function fetchShotCafeGenres(): Promise<string[]> {
    const response = await axios.get('https://shot.cafe/genres');
    const html = response.data;
    const $ = cheerio.load(html);
    const genres: string[] = [];
  
    // CSS selector converted from the given XPath.
    $("section > div > div:nth-of-type(2) > div > div:first-of-type > div > div > div > ul > li").each((i: number, el: any) => {
      const genre = $(el).text().trim();
      if(genre) {
        genres.push(genre);
      }
    });
    return genres;
  }

async function fetchShotCafeColors(): Promise<string[]> {
const response = await axios.get('https://shot.cafe/colors');
const html = response.data;
const $ = cheerio.load(html);
const colors: string[] = [];

// You will need to inspect the HTML to get the correct selector for colors.
$("section > div > div:nth-of-type(2) > div > div:first-of-type > div > div > div > ul > li").each((i: number, el: any) => {
    const color = $(el).text().trim();
    if(color) {
    colors.push(color);
    }
});
return colors;
}

async function fetchShotCafeTags(): Promise<string[]> {
const response = await axios.get('https://shot.cafe/tags');
const html = response.data;
const $ = cheerio.load(html);
const tags: string[] = [];

// Adjust the selector according to the DOM structure for tags.
$("section > div > div:nth-of-type(2) > div > div:first-of-type > div > div > div > ul > li").each((i: number, el: any) => {
    const tag = $(el).text().trim();
    if(tag) {
        const cleanedTag = tag.replace(/\s*\d[\d,]*$/, '');
        tags.push(cleanedTag);
    }
});
return tags;
}

async function fetchShotCafeAssets() {
const genres = await fetchShotCafeGenres();
const colors = await fetchShotCafeColors();
const tags = await fetchShotCafeTags();

return { genres, colors, tags };
}


async function determineStyleFrames(screenplayData: ScreenplayData, ai: any): Promise<any[]> {
    const assets = await fetchShotCafeAssets();

    // construct a prompt for gemini AI that provides these collections and the screenplay
    const prompt = `
    Given the following collections:
    Genres: ${JSON.stringify(assets.genres)}
    Colors: ${JSON.stringify(assets.colors)}
    Tags: ${JSON.stringify(assets.tags)} 
    And given the screenplay's coverage report:
    ${JSON.stringify(screenplayData.coverage_report, null, 2)}
    Select a combination of terms that best capture the film's visual style for a production pitch deck. Return exactly 5 hex color code representing the dominant colors (e.g. "#123456", "#ABCDEF") and one short descriptive tag chosen from the following list: [${assets.tags.join(
     ', '
   )}]. Return the result as a comma-separated list with no extra text.
   `;
    console.log("these are the tags: ", assets.tags);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash'});
    const result = await model.generateContent(prompt);
    let combination = await result.response.text();
    combination = combination.replace(/```/g, '').trim();
    console.log("Generated Combination: ", combination);

    // Process the combination into an array rather than a joined string.
    const processedCombinationArray = combination
      .split(',')
      .map((term: string) => term.trim())
      .map((term: string) => {
        // Remove wrapping quotes if any (e.g., '"#110D09"' -> '#110D09')
        term = term.replace(/^"+|"+$/g, '');
        return term.startsWith('#') ? term.substring(1) : term;
      });

    let tag = "";
    const geminiColors: string[] = [];

    if (processedCombinationArray.length > 1) {
      // Assume the last element is the descriptive tag.
      tag = processedCombinationArray[processedCombinationArray.length - 1];
      // The rest of the elements are hex codes.
      geminiColors.push(...processedCombinationArray.slice(0, processedCombinationArray.length - 1));
    } else {
      console.warn("Unexpected Gemini output; using defaults");
      tag = "night";
    }

    console.log("Parsed Gemini colors:", geminiColors, "Tag:", tag);

    const frames: any[] = [];

    for (let i = 0; i < 6; i++) {
        let color = "";
        if (geminiColors.length > i) {
            color = geminiColors[i];
        } else if (assets.colors.length > 0) {
            const randomColor = assets.colors[Math.floor(Math.random() * assets.colors.length)];
            const cleanedRandomColor = randomColor.replace(/\s*\d[\d,]*$/, '');
            color = cleanedRandomColor.startsWith('#') ? cleanedRandomColor.substring(1) : cleanedRandomColor;
        } else {
            console.warn("No color available; skipping iteration", i);
            continue;
        }

        const query = `${color},${tag}`;
        const queryUrl = `https://shot.cafe/tag/${query}`;
        console.log(`Iteration ${i} Query URL:`, queryUrl);

        try {
            const htmlResponse = await axios.get(queryUrl);
            const html = htmlResponse.data;
            const $ = cheerio.load(html);
            const imageSelector = "section > div:nth-of-type(6) > div:nth-of-type(1) > div > a > img";
            
            // Collect all images from the page
            const availableImages: string[] = [];
            $(imageSelector).each((index, el) => {
                let imgSrc = $(el).attr('src');
                if (imgSrc) {
                    let fullUrl = `https://shot.cafe${imgSrc}`;
                    // Replace "/images/t/" with "/images/o/" to get the correct URL
                    fullUrl = fullUrl.replace(/\/images\/t\//, '/images/o/');
                    availableImages.push(fullUrl);
                }
            });
            
            if (availableImages.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableImages.length);
                const randomImageUrl = availableImages[randomIndex];
                console.log("Selected random image:", randomImageUrl);
                frames.push({
                    image: randomImageUrl,
                    description: '',
                    reference: query
                });
            } else {
                console.warn("No images found for query:", query);
            }
        } catch (error) {
            console.error(`Error fetching images for ${query}:`, error);
        }
    }

    return frames;
}

////////////////////////////////////////////////////////////
// Slide Generator
////////////////////////////////////////////////////////////
export class SlideGenerator {
  private screenplayData: ScreenplayData;

  constructor(screenplayData: ScreenplayData) {
    this.screenplayData = screenplayData;
  }


  private async updateThemeConfig() {
    const config = await loadConfig("config.yaml");
    const ai = initializeAI(config.google_api_key);
    const screenplayTextSynopsis = this.screenplayData.coverage_report.comprehensive_synopsis;
    await updateThemeUsingAI(screenplayTextSynopsis, ai);
  }

  async generateSlide(config: SlideConfig): Promise<string> {
    // Directly format the prompt without using AI
    const formattedContent = this.formatPrompt(config.prompt);
    return formattedContent.trim();
  }

  private formatPrompt(prompt: string): string {
    return prompt.replace(/{{(\w+)}}/g, (match, key) => {
      switch (key) {
        case 'title_data':
          return JSON.stringify({
            title: "Bad Ass Girls",
            writer: this.screenplayData?.writer || 'Unknown Writer',
            backgroundImage: "https://cover.sli.dev"
          }, null, 2)

        case 'logline_data':
          return JSON.stringify({
            logline: this.screenplayData?.coverage_report?.logline || 'Logline not available',
            genre: this.screenplayData?.coverage_report?.production_scheme?.genre || 'Genre not specified',
            image: "/logline_images/logline_bad-ass-girls.jpeg"
          }, null, 2)
          
        case 'miranda_kent_details':
          const mirandaData = this.screenplayData.coverage_report.character_breakdowns
            .find(char => char.name === "Miranda Kent")
          
          if (!mirandaData) {
            console.warn('Miranda Kent character data not found')
            return JSON.stringify({
              name: 'Miranda Kent',
              type: 'lead',
              comps: [],
              gender: '',
              age_range: '',
              ethnicity: '',
              description: 'Character data not found'
            }, null, 2)
          } 

          return JSON.stringify({
            name: mirandaData.name,
            type: mirandaData.type,
            comps: mirandaData.comps,
            gender: mirandaData.gender,
            age_range: mirandaData.age_range,
            ethnicity: mirandaData.ethnicity,
            description: mirandaData.description
          }, null, 2)

        case 'lead_characters':
          const leadCharacters = this.screenplayData?.coverage_report?.character_breakdowns
            ?.filter(char => char.type === 'lead') || []
          
          return JSON.stringify(leadCharacters, null, 2)
          
        default:
          return match
          
          
          
      }
    })
  }





////////////////////////////////////////////////////////////
// Generate All Slides
////////////////////////////////////////////////////////////


  async generateAllSlides(): Promise<string> {
    const slides: string[] = [];

    // Fetch Cast Details
    const castNames = ["Bong Joon Ho", "Spike Lee", "Tom Malloy", "James Cameron"]
    const crewRoles = ["Director" , "Director", "Writer", "Director"]
    const crewDetails = await fetchCrewDetails(castNames, crewRoles);


    // Fetch comparable details 
    // ** TODO: FETCH COMPARABLES FROM JSON FILE
    const comparableTitles = ["Kill Bill", "Faster Pussycat! Kill! Kill!", "Sin City", "Machete", "Bitch Slap"];
    const updatedComparables = await fetchComparablesDetails(comparableTitles);


    const config = await loadConfig("config.yaml");
    const ai = initializeAI(config.google_api_key);


    // palette is an object with two properties: palette and description
    const palette = await determineLookBookPalette(this.screenplayData.coverage_report, ai);

    // Update theme config
    await this.updateThemeConfig();

    


    // Fetch Look Book images from backend
    const lookBookQuery = await determineLookBookImageQuery(this.screenplayData, ai);
    console.log("Look Book Query: ", lookBookQuery);
    // ** TODO: ADJUST parameters as needed (e.g. query, count, and model)
    const imagesResponse = await axios.get('http://localhost:3030/fetch-lookbook-images', {
      params: {
        model: 'unsplash',
        query: lookBookQuery,
        count: 3
      }
    });
    const lookBookImages = imagesResponse.data.images;

    



    // // Main Character portrait (single) details
    // const mainCharacter = this.screenplayData.coverage_report.character_breakdowns.find(char => char.name === "Miranda Kent");
    // if (!mainCharacter) {
    //   console.warn('Main character data not found');
    //   return JSON.stringify({});
    // }

    // mainCharacter.image = await fetchMainCharacterImage(mainCharacter);


    // // Fetch and Generate Character Portraits (multiple)
    // const characterBreakdowns = this.screenplayData.coverage_report.character_breakdowns.filter(char => char.type === 'lead');
    // const characters = await Promise.all(characterBreakdowns.map(async (character) => {
    //   try {
    //     const prompt = generateCharacterPrompt(character);
    //     console.log("This is the prompt: ", prompt);
    //     const response = await axios.post('http://localhost:3030/generate-image', { prompt });
    //     console.log("We got response back from: ", character.name);
    //     return { ...character, image: `data:image/jpeg;base64,${response.data.image}` };
    //   } catch (error) {
    //     console.error(`PEEEP Error generating image for ${character.name}:`, error);
    //     return { ...character, image: 'https://cover.sli.dev' };
    //   }
    // }));
    
    // console.log('Characters with images:', characters);


    // Update slideConfigs with the new fetched comparables
    const updatedSlideConfigs = await Promise.all(
        slideConfigs.map(async config => {
            if (config.name === 'title') {
                const backgroundImage = await generateTitleSlideBackground(this.screenplayData, ai);
                const titleData = {
                    title: this.screenplayData.title || '',
                    writer: this.screenplayData.writer || 'Unknown Writer',
                    backgroundImage: backgroundImage
                }
                return {
                    ...config,
                    prompt: config.prompt.replace(
                        /{{title_data}}/,
                        JSON.stringify(titleData, null, 2)
                        
                    )
                };
            }
      // if (config.name === 'lead_character') {
      //   return {
      //     ...config,
      //     prompt: config.prompt.replace(
      //       /{{main_character_details}}/,
      //       JSON.stringify(mainCharacter, null, 2)
      //     )
      //   }
      // }
      // if (config.name === 'lead_characters') {
      //   return {
      //     ...config,
      //     prompt: config.prompt.replace(
      //       /{{lead_characters}}/,
      //       JSON.stringify(characters, null, 2)
      //     )
      //   }
      // }
      if (config.name === 'comparables') {
        return {
          ...config,
          prompt: config.prompt.replace(
            /{{comparables}}/,
            JSON.stringify(updatedComparables, null, 2)
          )
        }
      } 
      if (config.name === 'crew') {
        return {
          ...config,
          prompt: config.prompt.replace(
            /{{crew_details}}/,
            JSON.stringify(crewDetails, null, 2)
          )
        }   
      }
      if (config.name === 'look_book') {
        return {
          ...config,
          prompt: config.prompt
            .replace(/{{\s*look_book_palette\s*}}/g, JSON.stringify(palette.palette, null, 2))
            .replace(/{{\s*look_book_description\s*}}/g, JSON.stringify(palette.description, null, 2))
            .replace(/{{\s*look_book_images\s*}}/g, JSON.stringify(lookBookImages, null, 2))
        }
      }
      if (config.name === 'style_frames') {
        const styleFrames = await determineStyleFrames(this.screenplayData, ai);
        return {
          ...config,
          prompt: config.prompt.replace(/{{\s*style_frames_data\s*}}/g, JSON.stringify(styleFrames, null, 2))
        };
      }
      return config;
    }));


    // console.log('Updated slide configs:', updatedSlideConfigs); 
    for (const config of updatedSlideConfigs) {
      try {
        const slideContent = await this.generateSlide(config);
        if (slideContent) {
          slides.push(slideContent.trim())
          console.log(`✓ Generated ${config.name} slide`)
        }
      } catch (error) {
        console.error(`× Failed to generate ${config.name} slide:`, error)  
      }
    }

    // Join slides with a single separator
    return slides.join('\n')
  }
}