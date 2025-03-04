export function generateCharacterPrompt(character: {
    name: string;
    type: string;
    comps?: string[];
    gender?: string;
    age_range?: string;
    ethnicity?: string;
    description?: string;
}): string {
    const { name, type, comps, gender, age_range, ethnicity, description } = character;
    let prompt = `Create a detailed character portrait of ${name}.`;

    if (gender) {
        prompt += ` Gender: ${gender}.`;
    }
    if (age_range) {
        prompt += ` Age range: ${age_range}.`;
    }
    if (ethnicity) {
        prompt += ` Ethnicity: ${ethnicity}.`;
    }
    prompt += ` This character is a ${type}.`;

    if (comps && comps.length > 0) {
        const similarActors = comps.join(', ');
        prompt += ` Similar to: ${similarActors}.`;
    }
    if (description) {
        prompt += ` ${description}`;
    }
    console.log(prompt);
    return prompt;
}


// export function buildVisualElementsPrompt(screenplayMetadata, collection) {
//     return `
//     Below is the screenplay metadata:
//     ${JSON.stringify(screenplayMetadata, null, 2)}
    
//     And below is the collection of visual elements available:
//     ${JSON.stringify(collection, null, 2)}

//     Analyze the metadata and select the best matching visual elements for the movie stills. Based on the tone and themes discussed in the screenplay, choose:

//     - A primary color (from the "colors" list)
//     - A secondary color (from the "colors" list)
//     - One or more tags (from the "tags" list)
//     - A genre (from the "genres" list)

//     Please return your answer as JSON with the following keys: "primaryColor", "secondaryColor", "tags", and "genre".
//     `
// }