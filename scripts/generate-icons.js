const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
    'icon.png': 1024,
    'adaptive-icon.png': 1024,
    'splash-icon.png': 200,
    'favicon.png': 48
};

async function generateIcons() {
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../assets/images/plus-icon.svg'));
    
    for (const [filename, size] of Object.entries(sizes)) {
        await sharp(svgBuffer)
            .resize(size, size)
            .toFile(path.join(__dirname, '../assets/images/', filename));
        console.log(`Generated ${filename}`);
    }
}

generateIcons().catch(console.error);
