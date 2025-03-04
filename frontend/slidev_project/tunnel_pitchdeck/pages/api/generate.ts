import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { SlideGenerator } from '../../SlideGenerator.js';
import path from 'path';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,   
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> =>
  new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    if (!files.scriptData || files.scriptData.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileData = files.scriptData[0];
    const fileContent = await fs.readFile(fileData.path, 'utf-8');
    const screenplayData = JSON.parse(fileContent);

    // Generate slides using your SlideGenerator (which uses main.ts & SlideGenerator.ts logic)
    const generator = new SlideGenerator(screenplayData);
    const slides = await generator.generateAllSlides();

    res.status(200).json({ slides });
  } catch (error: any) {
    console.error('Error generating slides:', error);
    res.status(500).json({ error: error.message || 'Error generating slides' });
  }
}