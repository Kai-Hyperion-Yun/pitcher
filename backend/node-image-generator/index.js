const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('yamljs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Try to load from config.yaml as fallback for local development
let config = {};
try {
  config = yaml.load('./config.yaml');
} catch (error) {
  console.warn('Could not load config.yaml, using only environment variables');
}

// Prioritize environment variables
const tmdbAPIKEY = process.env.TMDB_API_READ_ACCESS_TOKEN || config.TMDB_API_READ_ACCESS_TOKEN;
const GETIMG_apiKey = process.env.GETIMG_API_KEY || config.GETIMG_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || config.UNSPLASH_ACCESS_KEY;
const UNSPLASH_SECRET_KEY = process.env.UNSPLASH_SECRET_KEY || config.UNSPLASH_SECRET_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || config.PEXELS_API_KEY;

const cheerio = require('cheerio'); // This is used to load HTML and use jQuery syntax to traverse DOM



// Function to fetch iamges using Unsplash API
async function fetchFromUnsplash(query, count = 1) {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: { query, count },
            headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
        });
        
        const results = Array.isArray(response.data) ? response.data : [response.data];
        return results.map(photo => ({
            url: photo.urls.regular,
            caption: photo.alt_description || 'Unsplash image'
        }));
    } catch (error) {
        console.error('Error fetching from Unsplash:', error.message);
        return [];
    }
}

// Function to fetch images using Pexels API
async function fetchFromPexels(query, count = 1) {
    try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            params: { query, per_page: count },
            headers: { 'Authorization': PEXELS_API_KEY}
        });
        // response.data.photos is an array of objects
        return response.data.photos.map(photo => ({
            url: photo.src.medium,
            caption: photo.alt || 'Pexels image'
        }));
    } catch (error) {
        console.error('Error fetching from Pexels:', error.message);
        return [];
    }
}


// Endpoint to fetch look book images
// Expects query parameters: ?model=unsplash|pexels&query=<search terms>&count=<number>
app.get('/fetch-lookbook-images', async (req, res) => {
    const model = req.query.model ? req.query.model.toLowerCase() : 'unsplash';
    const query = req.query.query || 'cinematic';
    const count = parseInt(req.query.count) || 1;

    let images = [];

    if (model === 'unsplash') {
        images = await fetchFromUnsplash(query, count);
    } else if (model === 'pexels') {
        images = await fetchFromPexels(query, count);
    } else {
        return res.status(400).json({ error: 'Invalid model specified. Use iether "unsplash" or "pexels".'});
    }

    res.json({ images });
})



async function fetchHexCodes() {
    try {
        // Fetch the HTML from shot cafte
        const { data } = await axios.get('https://shot.cafe/colors');

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Select the target <ul> element using the specified path
        const ulElement = $('html > body > section > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > ul');

        // Initialize an array to store the hex codes
        const hexCodes = [];

        // Traverse each <li> in the <ul> and find the <a> tags
        ulElement.find('li > a').each((index, element) => {
            // Extract the style attribute and get the hex code
            const style = $(element).attr('style');
            const hexCodeMatch = style.match(/background-color:\s*#([0-9a-fA-F]{6})/);
            if (hexCodeMatch) {
                const hexCode = hexCodeMatch[1];
                hexCodes.push(`#${hexCodeMatch[1]}`);
            }
        });

        // console.log(hexCodes);
        return hexCodes;
    } catch (error) {
        console.error('Error fetching hex codes:', error.message);
    }
}

async function fetchTags() {
    try {
        // Fetch the HTML from shot cafe
        const { data } = await axios.get('https://shot.cafe/tags');

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        const ulElement = $('html > body > section > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > ul');
        
        const tags = [];

        // Traverse each <li> in the <ul> and find the <a> tags
        // For each <li>, lets extract the text contained int he <a> tag
        ulElement.find('li > a').each((index, element) => {
            const tag = $(element).text().trim();
            if (tag) {
                tags.push(tag.split(' ')[0]);
            }
        });

        // console.log(tags);
        return tags;
    } catch (error) {
        console.error('Error fetching tags:', error.message);
    }
}

async function fetchGenres() {
    try {
        const { data } = await axios.get('https://shot.cafe/genres');

        const $ = cheerio.load(data);

        const ulElement = $('html > body > section > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div > ul');

        const genres = [];

        ulElement.find('li > a').each((index, element) => {
            const genreText = $(element).text().trim();
            if (genreText) {
                genres.push(genreText);
            }
        });

        // console.log(genres);
        return genres;
    } catch (error) {
        console.error('Error fetching genres:', error.message);
    }
}

function sanitizeHex(hex) {
    return hex.replace('#', '');
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Combining all the 3 functions above:
async function buildShotCafeCollection() {
    // Promise.all to fetch colors, tags, and genres concurrently
    const [colors, tags, genres] = await Promise.all([
        fetchHexCodes(),
        fetchTags(),
        fetchGenres()
    ]);

    return { colors, tags, genres };
}



async function generateMovieStills(theme) {
    // First build the collection
    const collection = await buildShotCafeCollection();
    const images = [];

    // Generate 10 images.
    for (let i = 0; i < 10; i++) {
        let color1 = theme && theme.colors && theme.colors.primary ? theme.colors.primary : getRandomElement(collection.colors);
        let color2 = theme && theme.colors && theme.colors.secondary ? theme.colors.secondary : getRandomElement(collection.colors);
        let tag = theme && theme.tags && theme.tags.primary ? theme.tags.primary : getRandomElement(collection.tags);
        let genre = theme && theme.genres && theme.genres.primary ? theme.genres.primary : getRandomElement(collection.genres);

        const prompt = `A movie still from a ${genre} film with a ${color1} and ${color2} color scheme, featuring a ${tag} tagline.`;
        

    }
}



// This is to save the images locally (TEST purposes)
// const saveDirectory = path.join(__dirname, 'saved_images');
// if (!fs.existsSync(saveDirectory)) {
//     fs.mkdirSync(saveDirectory);
// }

app.post('/generate-image', async (req, res) => {
    const { model_name = 'essential-v2', prompt, negative_prompt } = req.body;

    const url = `https://api.getimg.ai/v1/${model_name}/text-to-image`;
    const headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${GETIMG_apiKey}`
    };
    console.log("This is API KEY: ", GETIMG_apiKey);
    const payload = {
        prompt,
        output_format: 'jpeg',
        response_format: 'b64'
    };

    if (model_name != 'essential-v2') {
        payload['width'] = 1024
        payload['height'] = 1024
    };

    if (model_name === 'essential-v2') {
        payload['style'] = 'photorealism';
    };

    if (model_name !== 'stable-diffusion-xl' && model_name !== 'flux-schnell' && negative_prompt) {
        payload['negative_prompt'] = negative_prompt;
    };

    try {
        const response = await axios.post(url, payload, { headers });
        res.json({ image: response.data.image });
    } catch (error) {
        console.error('Error generating image:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

// This async function is to fetch person details given the person name
async function getPersonDetails(personName) {
    const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(personName)}`;
    const headers = {
        "accept": "application/json",
        "Authorization": `Bearer ${tmdbAPIKEY}`
    }
    try {
        const response = await axios.get(url, { headers });
        // console.log("This is RESPONSEEEEE: ",response.data);
        if (response.data && response.data.results && response.data.results.length > 0) {
            const { id, profile_path } = response.data.results[0];
            const personImageUrl = `https://image.tmdb.org/t/p/original${profile_path}`;
            const personImageResponse = await axios.get(personImageUrl, { responseType: 'arraybuffer' });
            const personImageBuffer64 = Buffer.from(personImageResponse.data, 'binary').toString('base64');
            return {
                id,
                image: `data:image/jpeg;base64,${personImageBuffer64}`
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching person details:', error.message);
        return null;
    }
}


app.post('/fetch-person-details', async (req, res) => {
    const personName = req.body.personName;
    // console.log("person name: ", personName);
    const personDetails = await getPersonDetails(personName);
    res.json(personDetails);
});



// This async function is using multi search to find the movie ID given a title
async function getMovieId(title) {
    const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(title)}`;

    const headers = {
        "accept": "application/json",
        "Authorization": `Bearer ${tmdbAPIKEY}`
    }
    try {
        const response = await axios.get(url, { headers });
        if (response.data && response.data.results && response.data.results.length > 0) {
            const firstResult = response.data.results[0] // I am assuming the first result is the movie since it is most likely matching the title
            return firstResult.id;
        }
        return null;
    } catch (error) {
        console.error('Error fetching movie ID:', error.message);
        return null;
    }
}

// async functyion to get the movie details given the Movie ID
// outputs : budget, revenue, original_title, 
async function getMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}`
    const headers = {
        "accept": "application/json",
        "Authorization": `Bearer ${tmdbAPIKEY}`
    }
    try {
        const response = await axios.get(url, { headers });
        if (response.data) {
            const { budget, revenue, original_title, poster_path } = response.data;
            const imageUrl = `https://image.tmdb.org/t/p/original${poster_path}`;
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
            return {
                budget,
                revenue,
                original_title,
                image: `data:image/jpeg;base64,${imageBuffer64}`
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        return null;
    }
}



app.post('/fetch-comparable-details', async (req, res) => {
    const titles = req.body.titles; // input is an array of titles
    const results = {};

    for (const title of titles) {
        const movieId = await getMovieId(title);
        if (movieId) {
            const movieDetails = await getMovieDetails(movieId);
            if (movieDetails) {
                results[title] = movieDetails;
            }
        }
    }
    res.json(results);
});



app.post('/fetch-comp-images', async (req, res) => {
    const comps = req.body.comps;
    const results = {};

    for (const comp of comps) {
        const [titleName, year] = comp.includes('(') ? comp.split('(').map(s => s.trim().replace(')', '')) : [comp, ''];
        const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(titleName)}`;
        const headers = {
            "accept": "application/json",
            "Authorization": `Bearer ${tmdbAPIKEY}`
        } 
        try {
            const response = await axios.get(url, {headers});
            // console.log(response.data.results);
            if (response.data && response.data.results && response.data.results.length > 0) {
                let posterPath = null;
                for (const movie of response.data.results) {
                    //
                    if (year) {
                        if (movie.release_date && movie.release_date.startsWith(year)) {
                            posterPath = movie.poster_path;
                            break;
                        } else if (movie.first_air_date && movie.first_air_date.startsWith(year)) {
                            posterPath = movie.poster_path;
                            break;
                        }
                    }
                    if (!posterPath && movie.poster_path) {
                        posterPath = movie.poster_path;
                    }
                }
                if (posterPath) {
                    const imageUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
                    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    // const imagePath = path.join(saveDirectory, `${comp}.jpeg`);
                    // fs.writeFileSync(imagePath, imageResponse.data);

                    // changing the image buffer to a Base64-encoded string
                    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
                    results[comp] = `data:image/jpeg;base64,${base64Image}`;
                }
            }
        } catch (error) {
            console.error(`Error fetching data for ${comp}:`, error.message);
        }
    }
    console.log("backend: images fetched");
    res.json(results);
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    fetchGenres();
});
