import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { SlideGenerator } from '../../SlideGenerator.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let jsonData;

    // Parse the form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Check if we should use the default file
    if (fields.useDefault && fields.useDefault[0] === 'true') {
      // Read the default file
      const defaultFilePath = path.join(process.cwd(), 'bad-ass-girls.json');
      const fileContent = await fs.readFile(defaultFilePath, 'utf8');
      jsonData = JSON.parse(fileContent);
    } else if (files.scriptData) {
      // Read the uploaded file
      const filePath = files.scriptData[0].filepath;
      const fileContent = await fs.readFile(filePath, 'utf8');
      jsonData = JSON.parse(fileContent);
    } else {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Generate slides using the SlideGenerator
    const slideGenerator = new SlideGenerator(jsonData);
    const slides = await slideGenerator.generateAllSlides();

    return res.status(200).json({ slides });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Error processing request' });
  }
}