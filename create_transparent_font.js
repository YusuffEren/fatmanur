const fs = require('fs');
const path = require('path');

// 1x1 Transparent PNG (Base64)
const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const pngBuffer = Buffer.from(transparentPngBase64, 'base64');

const targetDir = path.join(__dirname, 'public', 'xp', 'msdf', 'CanelaText-Light');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, 'CanelaText-Light.png');
fs.writeFileSync(targetFile, pngBuffer);

console.log("Transparent typography texture saved to:", targetFile);
