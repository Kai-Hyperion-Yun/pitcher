const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');

// Import your SlideGenerator (ensure your TS is compiled to JS)
// Adjust the path to your compiled SlideGenerator
const { SlideGenerator } = require('./frontend/slidev_project/tunnel_pitchdeck/dist/SlideGenerator');

const app = express();
const port = process.env.PORT || 3000;

// Setup multer: uploaded files will be temporarily stored in the "uploads" folder.
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" folder.
app.use(express.static('public'));

// GET the upload page.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST endpoint to handle JSON file upload.
app.post('/upload', upload.single('jsonData'), async (req, res) => {
  try {
    // Read the uploaded JSON file.
    const uploadedPath = req.file.path;
    const jsonData = JSON.parse(fs.readFileSync(uploadedPath, 'utf8'));
    
    // Clean up the temporary file.
    fs.unlinkSync(uploadedPath);
    
    // Use your SlideGenerator to generate the slides markdown.
    const slideGenerator = new SlideGenerator(jsonData);
    const slidesContent = await slideGenerator.generateAllSlides();

    // Save the generated slides.md to a fixed location (here in public for easy serving).
    const outputPath = path.join(__dirname, 'public', 'slides.md');
    fs.writeFileSync(outputPath, slidesContent, 'utf8');

    // Option 1: Directly redirect user to a page that displays the slides markdown.
    // Option 2: Trigger a build of a static Slidev site (using slidev CLI) and serve that.
    // For this example we'll simply redirect to a page that shows the generated slides.
    res.redirect('/slides.html');
    
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).send('Server error processing the file.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});