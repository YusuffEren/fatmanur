const fs = require('fs');
const txt = fs.readFileSync('public/wp-content/themes/fatmanur/app-fatmanur-v3.js', 'utf8');

const base64Images = txt.match(/data:image\/[a-zA-Z]*;base64,[^\s"']+/g);
if (base64Images) {
    console.log("Found base64 images! Count:", base64Images.length);
    base64Images.slice(0, 5).forEach((b64, i) => {
        fs.writeFileSync(`parsed_img_${i}.png`, b64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        console.log(`Saved parsed_img_${i}.png`);
    });
} else {
    console.log("No base64 images found.");
}
