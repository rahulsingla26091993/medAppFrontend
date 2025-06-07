const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/images/splash-icon.svg');
const pngPath = path.join(__dirname, '../assets/images/splash-icon.png');

sharp(svgPath)
  .resize(3072, 3072) // Increased size for better display on all devices
  .png()
  .toFile(pngPath)
  .then(() => console.log('Splash icon created successfully!'))
  .catch(err => console.error('Error creating splash icon:', err));
