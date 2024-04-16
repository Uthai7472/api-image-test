const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Serve the files in the 'custom-folder' directory
app.use('/images', express.static(path.join(__dirname, 'custom-folder')));

// API endpoint to serve the image file
app.get('/get-image/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'custom-folder', imageName);
    
    // Check if the image file exists
    if (fs.existsSync(imagePath)) {
        // If the image file exists, send it as a response
        const imageData = fs.readFileSync(imagePath);
        res.contentType('image/jpeg'); // Set the appropriate content type based on the image type
        res.send(imageData);
    } else {
        // If the image file does not exist, send a 404 Not Found response
        res.status(404).send('Image not found');
    }
});

app.post('/upload', upload.single('image'), (req, res) => {
  // Process the uploaded file here
  // Save it to a suitable location on the server
  // Return the URL or file path of the uploaded image

  const uploadedFilePath = req.file.path;
  const imageUrl = `http://localhost:3001/${uploadedFilePath}`;

  // Create the destination directory if it doesn't exist
  const destinationDir = path.join(__dirname, 'custom-folder');
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  // Save the file to the destination directory
  const targetPath = path.join(destinationDir, req.file.originalname);
  fs.renameSync(uploadedFilePath, targetPath);

  // Read the saved file and send it as a response
  const imageData = fs.readFileSync(targetPath);
  res.contentType('image/jpeg');
  res.send(imageData);

  console.log("Uploaded");
});

app.listen(3001, () => {
  console.log('Server is running...');
});
